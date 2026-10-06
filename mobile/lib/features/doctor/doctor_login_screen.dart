import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/auth/auth_models.dart';
import '../../core/auth/auth_service.dart';
import '../../core/widgets/ui.dart';

class DoctorLoginScreen extends StatelessWidget {
  const DoctorLoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthService>();
    return PortalLoginForm(
      title: 'Doctor login',
      subtitle: 'Accept requests, manage earnings and today’s visits.',
      demoEmail: SeedAccounts.doctorEmail,
      demoPassword: SeedAccounts.doctorPassword,
      accent: const Color(0xFF0B6E99),
      onBack: () => context.go('/'),
      onSubmit: (email, password) async {
        final err = await auth.login(
          portal: AppRole.doctor,
          email: email,
          password: password,
        );
        if (err == null && context.mounted) context.go('/doctor/home');
        return err;
      },
    );
  }
}
