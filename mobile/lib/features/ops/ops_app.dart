import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../app/theme.dart';
import '../../core/auth/auth_service.dart';
import '../../core/widgets/ui.dart';

class OpsHomePage extends StatelessWidget {
  const OpsHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final wide = MediaQuery.sizeOf(context).width >= 800;

    return Scaffold(
      backgroundColor: const Color(0xFFF2F4F5),
      appBar: AppBar(
        title: const Text('Control Tower'),
        actions: [
          TextButton(
            onPressed: () async {
              await auth.logout();
              if (context.mounted) context.go('/');
            },
            child: const Text('Sign out'),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Welcome, ${auth.user?.name ?? 'Founder'}',
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
          ),
          const Text(
            'Ops portal — separate login from Patient & Doctor apps',
            style: TextStyle(color: CvColors.textSecondary),
          ),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: wide ? 4 : 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 1.35,
            children: const [
              _Kpi(label: 'Open tasks', value: '18'),
              _Kpi(label: 'Blocked', value: '2', danger: true),
              _Kpi(label: 'Completion', value: '38%'),
              _Kpi(label: 'Month burn', value: '₹4.2L'),
            ],
          ),
          const SizedBox(height: 14),
          const Card(
            child: ListTile(
              leading: Icon(Icons.warning_amber_rounded, color: CvColors.warning),
              title: Text('P0 blocker · Socket.IO gateway', style: TextStyle(fontWeight: FontWeight.w800)),
              subtitle: Text('Escalate to Founder if > 4h'),
            ),
          ),
          const Card(
            child: ListTile(
              leading: Icon(Icons.fact_check_outlined, color: CvColors.primary),
              title: Text('3 founder approvals pending', style: TextStyle(fontWeight: FontWeight.w800)),
              subtitle: Text('Release · Travel · Expense'),
            ),
          ),
          const Card(
            child: ListTile(
              leading: Icon(Icons.rocket_launch_outlined, color: CvColors.ops),
              title: Text('Curevanta launch gate', style: TextStyle(fontWeight: FontWeight.w800)),
              subtitle: Text('Internal RC 15–20 Dec · Final 31 Dec 2026'),
            ),
          ),
          const SizedBox(height: 12),
          CvButton(
            label: 'Open full web Control Tower',
            color: CvColors.ops,
            outlined: true,
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Run Next.js app at localhost:3000/dashboard for full Ops OS'),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _Kpi extends StatelessWidget {
  const _Kpi({required this.label, required this.value, this.danger = false});
  final String label;
  final String value;
  final bool danger;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(color: CvColors.textMuted, fontSize: 12, fontWeight: FontWeight.w700)),
            const Spacer(),
            Text(
              value,
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w900,
                color: danger ? CvColors.error : CvColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
