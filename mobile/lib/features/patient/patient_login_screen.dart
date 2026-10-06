import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../app/theme.dart';
import '../../core/auth/auth_models.dart';
import '../../core/auth/auth_service.dart';
import '../../core/widgets/ui.dart';

class PatientLoginScreen extends StatelessWidget {
  const PatientLoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthService>();
    return PortalLoginForm(
      title: 'Patient login',
      subtitle: 'Book doctors, track visits, manage family care.',
      demoEmail: SeedAccounts.patientEmail,
      demoPassword: SeedAccounts.patientPassword,
      accent: CvColors.primary,
      onBack: () => context.go('/'),
      onSubmit: (email, password) async {
        final err = await auth.login(
          portal: AppRole.patient,
          email: email,
          password: password,
        );
        if (err == null && context.mounted) context.go('/patient/home');
        return err;
      },
    );
  }
}
