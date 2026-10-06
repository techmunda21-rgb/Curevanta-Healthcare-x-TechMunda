import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../app/theme.dart';
import '../../core/auth/auth_models.dart';
import '../../core/auth/auth_service.dart';
import '../../core/widgets/ui.dart';

class OpsLoginScreen extends StatelessWidget {
  const OpsLoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthService>();
    return PortalLoginForm(
      title: 'Ops / Founder login',
      subtitle: 'Control Tower — health, blockers, burn, approvals.',
      demoEmail: SeedAccounts.opsEmail,
      demoPassword: SeedAccounts.opsPassword,
      accent: CvColors.ops,
      onBack: () => context.go('/'),
      onSubmit: (email, password) async {
        final err = await auth.login(
          portal: AppRole.ops,
          email: email,
          password: password,
        );
        if (err == null && context.mounted) context.go('/ops/home');
        return err;
      },
    );
  }
}
