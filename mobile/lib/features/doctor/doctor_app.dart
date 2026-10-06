import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../app/theme.dart';
import '../../core/auth/auth_service.dart';
import '../../core/widgets/ui.dart';

class DoctorHomePage extends StatefulWidget {
  const DoctorHomePage({super.key});

  @override
  State<DoctorHomePage> createState() => _DoctorHomePageState();
}

class _DoctorHomePageState extends State<DoctorHomePage> {
  bool online = true;
  bool showRequest = true;

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final name = auth.user?.name ?? 'Doctor';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Doctor App'),
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
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
                    Text(
                      online ? 'Online · accepting requests' : 'Offline',
                      style: TextStyle(
                        color: online ? CvColors.primary : CvColors.textMuted,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              Switch(
                value: online,
                activeTrackColor: const Color(0xFF0B6E99),
                onChanged: (v) => setState(() => online = v),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(22),
              gradient: const LinearGradient(
                colors: [Color(0xFF0B6E99), Color(0xFF095A7D)],
              ),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Today's earnings", style: TextStyle(color: Colors.white70)),
                Text('₹2,450', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900)),
                SizedBox(height: 8),
                Text('4 completed · 2 upcoming', style: TextStyle(color: Colors.white70)),
              ],
            ),
          ),
          if (online && showRequest) ...[
            const SizedBox(height: 14),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('INCOMING REQUEST',
                        style: TextStyle(color: Color(0xFF0B6E99), fontWeight: FontWeight.w800, fontSize: 11)),
                    const Text('Doctor at Home', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                    const Text('Priya Sharma · Indiranagar · 2.4 km',
                        style: TextStyle(color: CvColors.textSecondary)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: CvButton(
                            label: 'Decline',
                            outlined: true,
                            color: CvColors.error,
                            onPressed: () => setState(() => showRequest = false),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: CvButton(
                            label: 'Accept',
                            color: const Color(0xFF0B6E99),
                            onPressed: () => setState(() => showRequest = false),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
          const SizedBox(height: 16),
          const Text("Today's bookings", style: TextStyle(fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          for (final b in [
            ('Aarav Patel', '11:30 AM', 'Upcoming'),
            ('Meera Iyer', '1:00 PM', 'On the way'),
            ('Kabir Shah', '3:30 PM', 'Upcoming'),
          ])
            Card(
              child: ListTile(
                title: Text(b.$1, style: const TextStyle(fontWeight: FontWeight.w800)),
                subtitle: Text(b.$2),
                trailing: Chip(label: Text(b.$3)),
              ),
            ),
        ],
      ),
    );
  }
}
