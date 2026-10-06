import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/theme.dart';
import '../../core/auth/auth_models.dart';
import '../../core/widgets/ui.dart';

class HubScreen extends StatelessWidget {
  const HubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const Spacer(),
                  const CvLogo(size: 80, color: CvColors.primary),
                  const SizedBox(height: 16),
                  Text(
                    'Curevanta',
                    style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                          fontWeight: FontWeight.w900,
                        ),
                  ),
                  const Text(
                    'Care. Closer to You.',
                    style: TextStyle(
                      color: CvColors.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'One app · three portals · separate secure logins',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: CvColors.textSecondary),
                  ),
                  const Spacer(),
                  _PortalCard(
                    role: AppRole.patient,
                    icon: Icons.favorite_outline,
                    color: CvColors.primary,
                    onTap: () => context.go(AppRole.patient.loginPath),
                  ),
                  const SizedBox(height: 12),
                  _PortalCard(
                    role: AppRole.doctor,
                    icon: Icons.medical_services_outlined,
                    color: const Color(0xFF0B6E99),
                    onTap: () => context.go(AppRole.doctor.loginPath),
                  ),
                  const SizedBox(height: 12),
                  _PortalCard(
                    role: AppRole.ops,
                    icon: Icons.dashboard_customize_outlined,
                    color: CvColors.ops,
                    onTap: () => context.go(AppRole.ops.loginPath),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PortalCard extends StatelessWidget {
  const _PortalCard({
    required this.role,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  final AppRole role;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: CvColors.border),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 26,
                backgroundColor: color.withValues(alpha: 0.12),
                child: Icon(icon, color: color),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${role.label} App',
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
                    ),
                    Text(role.subtitle, style: const TextStyle(color: CvColors.textSecondary)),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios_rounded, size: 16, color: color),
            ],
          ),
        ),
      ),
    );
  }
}
