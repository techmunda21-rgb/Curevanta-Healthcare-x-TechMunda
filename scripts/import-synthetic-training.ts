/**
 * Import Curevanta India Healthcare Synthetic Training Data (xlsx)
 * → Postgres tables + latency training samples.
 *
 * DEV / synthetic only — not real PHI.
 *
 * Usage: npx tsx scripts/import-synthetic-training.ts
 */
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";
import { buildLatencySamples, trainLatencyModel } from "../src/lib/ai/latency-model";

const prisma = new PrismaClient();

const DATASET =
  process.env.SYNTHETIC_XLSX_PATH ??
  path.join(
    process.cwd(),
    "data/synthetic/Curevanta_India_Healthcare_Synthetic_Training_Data.xlsx",
  );

function yes(v: unknown) {
  return String(v ?? "").toLowerCase() === "yes";
}

function num(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function sheetRows(wb: XLSX.WorkBook, name: string): Record<string, unknown>[] {
  const sheet = wb.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
}

async function main() {
  if (!fs.existsSync(DATASET)) {
    throw new Error(`Dataset not found: ${DATASET}`);
  }

  console.log("📥 Loading", DATASET);
  const wb = XLSX.readFile(DATASET);

  const doctors = sheetRows(wb, "Synthetic Doctors");
  const patients = sheetRows(wb, "Synthetic Patients");
  const careers = sheetRows(wb, "Synthetic Career Candidates");
  const taxonomy = sheetRows(wb, "Healthcare Role Taxonomy");

  console.log(
    `Rows: doctors=${doctors.length} patients=${patients.length} careers=${careers.length} taxonomy=${taxonomy.length}`,
  );

  console.log("🧹 Clearing previous synthetic imports…");
  await prisma.latencyTrainingSample.deleteMany();
  await prisma.latencyModelArtifact.updateMany({ data: { isActive: false } });
  await prisma.syntheticProvider.deleteMany();
  await prisma.syntheticPatientPersona.deleteMany();
  await prisma.syntheticCareerCandidate.deleteMany();
  await prisma.healthcareRoleTaxonomy.deleteMany();

  console.log("👨‍⚕️ Importing providers…");
  const providerBatch = doctors.map((r) => ({
    providerCode: String(r.Provider_ID),
    state: String(r.State),
    city: String(r.City),
    providerType: String(r.Provider_Type),
    specialty: String(r.Specialty),
    qualification: String(r.Qualification || "") || null,
    experienceYears: Math.round(num(r.Experience_Years)),
    languages: String(r.Languages || "") || null,
    workSetting: String(r.Work_Setting || "") || null,
    homeVisitEligible: yes(r.Home_Visit_Eligible),
    teleconsultEligible: yes(r.Teleconsult_Eligible),
    verificationStatus: String(r.Verification_Status || "") || null,
    availabilityStatus: String(r.Availability_Status || "") || null,
    ratingSimulated: num(r.Rating_Simulated, 4.5),
    sourceType: String(r.Source_Type || "SYNTHETIC"),
  }));
  for (let i = 0; i < providerBatch.length; i += 250) {
    await prisma.syntheticProvider.createMany({
      data: providerBatch.slice(i, i + 250),
      skipDuplicates: true,
    });
  }

  console.log("🧑‍🤝‍🧑 Importing patient personas…");
  const patientBatch = patients.map((r) => ({
    patientCode: String(r.Patient_ID),
    state: String(r.State),
    city: String(r.City),
    ageBand: String(r.Age_Band || "") || null,
    genderSynthetic: String(r.Gender_Synthetic || "") || null,
    careNeedCategory: String(r.Care_Need_Category || "") || null,
    urgencySynthetic: String(r.Urgency_Synthetic || "") || null,
    preferredMode: String(r.Preferred_Mode || "") || null,
    language: String(r.Language || "") || null,
    mobilityAssistance: String(r.Mobility_Assistance || "") || null,
    bookingStatus: String(r.Booking_Status || "") || null,
    paymentModeSynthetic: String(r.Payment_Mode_Synthetic || "") || null,
    outcomeLabelSynthetic: String(r.Outcome_Label_Synthetic || "") || null,
    sourceType: String(r.Source_Type || "SYNTHETIC"),
  }));
  for (let i = 0; i < patientBatch.length; i += 250) {
    await prisma.syntheticPatientPersona.createMany({
      data: patientBatch.slice(i, i + 250),
      skipDuplicates: true,
    });
  }

  console.log("💼 Importing career candidates…");
  const careerBatch = careers.map((r) => ({
    candidateCode: String(r.Candidate_ID),
    state: String(r.State),
    city: String(r.City),
    careerTrack: String(r.Career_Track || "") || null,
    educationLevel: String(r.Education_Level || "") || null,
    experienceBand: String(r.Experience_Band || "") || null,
    skill1: String(r.Skill_1 || "") || null,
    skill2: String(r.Skill_2 || "") || null,
    preferredWorkMode: String(r.Preferred_Work_Mode || "") || null,
    trainingNeed: String(r.Training_Need || "") || null,
    applicationStage: String(r.Application_Stage || "") || null,
    assessmentScoreSimulated: num(r.Assessment_Score_Simulated, 0) || null,
    sourceType: String(r.Source_Type || "SYNTHETIC"),
  }));
  for (let i = 0; i < careerBatch.length; i += 250) {
    await prisma.syntheticCareerCandidate.createMany({
      data: careerBatch.slice(i, i + 250),
      skipDuplicates: true,
    });
  }

  console.log("📚 Importing role taxonomy…");
  const taxonomyBatch = taxonomy.map((r) => ({
    roleCategory: String(r.Role_Category || "Unknown"),
    exampleRole: String(r.Example_Role || "Unknown"),
    typicalEducation: String(r.Typical_Education || "") || null,
    curevantaModuleUse: String(r.Curevanta_Module_Use || "") || null,
    officialReference: String(r.Official_Reference || "") || null,
  }));
  for (let i = 0; i < taxonomyBatch.length; i += 250) {
    await prisma.healthcareRoleTaxonomy.createMany({ data: taxonomyBatch.slice(i, i + 250) });
  }

  console.log("⏱️ Building latency training samples…");
  const samples = buildLatencySamples(
    providerBatch.map((p) => ({
      code: p.providerCode,
      city: p.city,
      state: p.state,
      specialty: p.specialty,
      experienceYears: p.experienceYears,
      rating: p.ratingSimulated ?? 4.5,
      online: (p.availabilityStatus || "").toLowerCase() === "online",
      homeVisit: p.homeVisitEligible,
    })),
    patientBatch.map((p) => ({
      code: p.patientCode,
      city: p.city,
      state: p.state,
      urgency: p.urgencySynthetic || "Routine",
      preferredMode: p.preferredMode || "Home Visit",
      careNeed: p.careNeedCategory || "General",
    })),
  );

  for (let i = 0; i < samples.length; i += 250) {
    await prisma.latencyTrainingSample.createMany({
      data: samples.slice(i, i + 250).map((s) => ({
        sampleKey: s.sampleKey,
        city: s.city,
        state: s.state,
        specialty: s.specialty,
        urgency: s.urgency,
        preferredMode: s.preferredMode,
        providerOnline: s.providerOnline,
        experienceYears: s.experienceYears,
        rating: s.rating,
        labelLatencyMin: s.labelLatencyMin,
        featuresJson: s.features,
      })),
      skipDuplicates: true,
    });
  }

  console.log(`🧠 Training latency model on ${samples.length} samples…`);
  const artifact = trainLatencyModel(samples);
  const version = `latency-v${Date.now()}`;

  await prisma.latencyModelArtifact.updateMany({ data: { isActive: false } });
  await prisma.latencyModelArtifact.create({
    data: {
      version,
      sampleCount: artifact.sampleCount,
      maeMinutes: artifact.maeMinutes,
      rmseMinutes: artifact.rmseMinutes,
      weightsJson: artifact.weights,
      notes:
        "Operational dispatch latency (minutes). Synthetic labels only — not clinical diagnosis.",
      isActive: true,
    },
  });

  const modelPath = path.join(process.cwd(), "data/models/latency-model.json");
  fs.writeFileSync(
    modelPath,
    JSON.stringify({ version, ...artifact, trainedAt: new Date().toISOString() }, null, 2),
  );

  console.log("✅ Import + latency train complete");
  console.log(`   Active model: ${version}`);
  console.log(`   MAE: ${artifact.maeMinutes.toFixed(2)} min · RMSE: ${artifact.rmseMinutes.toFixed(2)} min`);
  console.log(`   Artifact: ${modelPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
