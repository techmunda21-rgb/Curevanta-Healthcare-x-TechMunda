import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../app/theme.dart';
import '../../core/auth/auth_service.dart';
import '../../core/widgets/ui.dart';

class PatientShell extends StatelessWidget {
  const PatientShell({super.key, required this.child});
  final Widget child;

  static const tabs = [
    ('/patient/home', 'Home', Icons.home_rounded),
    ('/patient/bookings', 'Bookings', Icons.calendar_month_rounded),
    ('/patient/care', 'Care', Icons.favorite_rounded),
    ('/patient/profile', 'Profile', Icons.person_rounded),
  ];

  int _index(String loc) {
    for (var i = 0; i < tabs.length; i++) {
      if (loc.startsWith(tabs[i].$1)) return i;
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final loc = GoRouterState.of(context).uri.toString();
    final idx = _index(loc);
    final wide = MediaQuery.sizeOf(context).width >= 900;
    final user = context.watch<AuthService>().user;

    return Scaffold(
      body: Row(
        children: [
          if (wide)
            NavigationRail(
              selectedIndex: idx,
              onDestinationSelected: (i) => context.go(tabs[i].$1),
              labelType: NavigationRailLabelType.all,
              destinations: [
                for (final t in tabs)
                  NavigationRailDestination(
                    icon: Icon(t.$3),
                    label: Text(t.$2),
                  ),
              ],
            ),
          Expanded(
            child: Column(
              children: [
                SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                    child: Row(
                      children: [
                        const Text(
                          'Patient',
                          style: TextStyle(
                            color: CvColors.primary,
                            fontWeight: FontWeight.w800,
                            fontSize: 12,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          user?.name ?? '',
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ),
                ),
                Expanded(child: child),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: wide
          ? null
          : NavigationBar(
              selectedIndex: idx.clamp(0, tabs.length - 1),
              onDestinationSelected: (i) => context.go(tabs[i].$1),
              destinations: [
                for (final t in tabs)
                  NavigationDestination(icon: Icon(t.$3), label: t.$2),
              ],
            ),
    );
  }
}

class PatientHomePage extends StatelessWidget {
  const PatientHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final name = context.watch<AuthService>().user?.name.split(' ').first ?? 'there';
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text('Good day, $name 👋',
            style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900)),
        const SizedBox(height: 6),
        const Text('How can we help you today?',
            style: TextStyle(color: CvColors.textSecondary)),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            gradient: const LinearGradient(
              colors: [CvColors.primary, CvColors.primaryPressed],
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Care, when and where you need it',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 18)),
              const SizedBox(height: 8),
              const Text('Doctor · Nurse · Diagnostics at home',
                  style: TextStyle(color: Colors.white70)),
              const SizedBox(height: 14),
              FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: CvColors.primary,
                  minimumSize: const Size(0, 40),
                ),
                onPressed: () => context.push('/patient/book'),
                child: const Text('Find Care'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: MediaQuery.sizeOf(context).width >= 700 ? 6 : 3,
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 0.95,
          children: [
            for (final s in [
              'Doctor at Home',
              'Nurse at Home',
              'Diagnostics',
              'Physio',
              'Elder Care',
              'Follow-up',
            ])
              Card(
                child: InkWell(
                  onTap: () => context.push('/patient/book'),
                  child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.medical_services_outlined, color: CvColors.primary),
                        const SizedBox(height: 6),
                        Text(
                          s,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}

class PatientBookingsPage extends StatelessWidget {
  const PatientBookingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Bookings', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
        const SizedBox(height: 12),
        Card(
          child: ListTile(
            title: const Text('Dr. Rohan Mehta', style: TextStyle(fontWeight: FontWeight.w800)),
            subtitle: const Text('Today · 10:30 AM · On the way'),
            trailing: const Chip(label: Text('Active')),
            onTap: () => context.push('/patient/tracking'),
          ),
        ),
        const SizedBox(height: 8),
        CvButton(label: 'Book new care', onPressed: () => context.push('/patient/book')),
      ],
    );
  }
}

class PatientCarePage extends StatelessWidget {
  const PatientCarePage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Text('Care plans', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
        SizedBox(height: 12),
        Card(
          child: ListTile(
            title: Text('Elder Care — Weekly', style: TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text('Next visit Friday · Nurse assigned'),
          ),
        ),
        Card(
          child: ListTile(
            title: Text('Diabetes Follow-up', style: TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text('Next check-in in 5 days'),
          ),
        ),
      ],
    );
  }
}

class PatientProfilePage extends StatelessWidget {
  const PatientProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final u = auth.user;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text('Profile', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
        const SizedBox(height: 12),
        Card(
          child: ListTile(
            leading: const CircleAvatar(backgroundColor: CvColors.primarySoft, child: Icon(Icons.person, color: CvColors.primary)),
            title: Text(u?.name ?? '', style: const TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text(u?.email ?? ''),
          ),
        ),
        const Card(child: ListTile(title: Text('Manage addresses'), trailing: Icon(Icons.chevron_right))),
        const Card(child: ListTile(title: Text('Family members'), trailing: Icon(Icons.chevron_right))),
        const Card(child: ListTile(title: Text('Health records'), trailing: Icon(Icons.chevron_right))),
        const SizedBox(height: 12),
        CvButton(
          label: 'Sign out of Patient app',
          outlined: true,
          onPressed: () async {
            await auth.logout();
            if (context.mounted) context.go('/');
          },
        ),
      ],
    );
  }
}

class PatientBookFlowPage extends StatelessWidget {
  const PatientBookFlowPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Book care')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          for (final s in ['Doctor at Home', 'Nurse at Home', 'Diagnostics at Home'])
            Card(
              child: ListTile(
                title: Text(s, style: const TextStyle(fontWeight: FontWeight.w800)),
                subtitle: const Text('Verified providers near Indiranagar'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => context.push('/patient/tracking'),
              ),
            ),
        ],
      ),
    );
  }
}

class PatientTrackingPage extends StatelessWidget {
  const PatientTrackingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live tracking')),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            color: CvColors.success,
            padding: const EdgeInsets.all(12),
            child: const Text(
              'Doctor is on the way · 12 min',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
            ),
          ),
          Expanded(
            child: Container(
              color: const Color(0xFFDCECEB),
              alignment: Alignment.center,
              child: const Text('Map route preview', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ),
          const ListTile(
            leading: CircleAvatar(child: Icon(Icons.person)),
            title: Text('Dr. Rohan Mehta', style: TextStyle(fontWeight: FontWeight.w800)),
            subtitle: Text('General Physician · On the way'),
          ),
        ],
      ),
    );
  }
}
