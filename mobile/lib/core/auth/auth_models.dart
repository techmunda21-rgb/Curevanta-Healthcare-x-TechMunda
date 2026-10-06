enum AppRole { patient, doctor, ops }

extension AppRoleX on AppRole {
  String get label => switch (this) {
        AppRole.patient => 'Patient',
        AppRole.doctor => 'Doctor',
        AppRole.ops => 'Ops / Founder',
      };

  String get subtitle => switch (this) {
        AppRole.patient => 'Book care at home',
        AppRole.doctor => 'Accept & manage visits',
        AppRole.ops => 'Control Tower execution',
      };

  String get homePath => switch (this) {
        AppRole.patient => '/patient/home',
        AppRole.doctor => '/doctor/home',
        AppRole.ops => '/ops/home',
      };

  String get loginPath => switch (this) {
        AppRole.patient => '/patient/login',
        AppRole.doctor => '/doctor/login',
        AppRole.ops => '/ops/login',
      };
}

class AppUser {
  const AppUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
  });

  final String id;
  final String name;
  final String email;
  final AppRole role;
}

/// Seed accounts — one portal each. Password is role-specific.
class SeedAccounts {
  static const patientEmail = 'patient@curevanta.app';
  static const patientPassword = 'Patient@2026';
  static const patientName = 'Priya Sharma';

  static const doctorEmail = 'doctor@curevanta.app';
  static const doctorPassword = 'Doctor@2026';
  static const doctorName = 'Dr. Rohan Mehta';

  static const opsEmail = 'founder@techmunda.com';
  static const opsPassword = 'Founder@2026';
  static const opsName = 'Founder';

  static AppUser? authenticate({
    required AppRole portal,
    required String email,
    required String password,
  }) {
    final e = email.trim().toLowerCase();
    final p = password;

    switch (portal) {
      case AppRole.patient:
        if (e == patientEmail && p == patientPassword) {
          return const AppUser(
            id: 'u-patient',
            name: patientName,
            email: patientEmail,
            role: AppRole.patient,
          );
        }
      case AppRole.doctor:
        if (e == doctorEmail && p == doctorPassword) {
          return const AppUser(
            id: 'u-doctor',
            name: doctorName,
            email: doctorEmail,
            role: AppRole.doctor,
          );
        }
      case AppRole.ops:
        if (e == opsEmail && p == opsPassword) {
          return const AppUser(
            id: 'u-ops',
            name: opsName,
            email: opsEmail,
            role: AppRole.ops,
          );
        }
    }
    return null;
  }
}
