import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/auth/auth_models.dart';
import '../core/auth/auth_service.dart';
import '../features/doctor/doctor_app.dart';
import '../features/doctor/doctor_login_screen.dart';
import '../features/hub/hub_screen.dart';
import '../features/ops/ops_app.dart';
import '../features/ops/ops_login_screen.dart';
import '../features/patient/patient_app.dart';
import '../features/patient/patient_login_screen.dart';

GoRouter createRouter(AuthService auth) {
  return GoRouter(
    initialLocation: '/',
    refreshListenable: auth,
    redirect: (context, state) {
      if (!auth.isReady) return null;

      final loc = state.matchedLocation;
      final role = auth.role;

      bool isPatient = loc.startsWith('/patient');
      bool isDoctor = loc.startsWith('/doctor');
      bool isOps = loc.startsWith('/ops');
      bool isLogin = loc.endsWith('/login');
      bool isPublic = loc == '/' || isLogin;

      if (!auth.isLoggedIn) {
        // Allow hub + each portal login only
        if (isPublic) return null;
        if (isPatient) return AppRole.patient.loginPath;
        if (isDoctor) return AppRole.doctor.loginPath;
        if (isOps) return AppRole.ops.loginPath;
        return '/';
      }

      // Logged in — hard isolation between sub-apps
      if (role == AppRole.patient) {
        if (isDoctor || isOps) return AppRole.patient.homePath;
        if (loc == '/' || loc == AppRole.patient.loginPath) return AppRole.patient.homePath;
      }
      if (role == AppRole.doctor) {
        if (isPatient || isOps) return AppRole.doctor.homePath;
        if (loc == '/' || loc == AppRole.doctor.loginPath) return AppRole.doctor.homePath;
      }
      if (role == AppRole.ops) {
        if (isPatient || isDoctor) return AppRole.ops.homePath;
        if (loc == '/' || loc == AppRole.ops.loginPath) return AppRole.ops.homePath;
      }
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const HubScreen()),
      GoRoute(path: '/patient/login', builder: (_, __) => const PatientLoginScreen()),
      GoRoute(path: '/doctor/login', builder: (_, __) => const DoctorLoginScreen()),
      GoRoute(path: '/ops/login', builder: (_, __) => const OpsLoginScreen()),
      ShellRoute(
        builder: (_, __, child) => PatientShell(child: child),
        routes: [
          GoRoute(path: '/patient/home', builder: (_, __) => const PatientHomePage()),
          GoRoute(path: '/patient/bookings', builder: (_, __) => const PatientBookingsPage()),
          GoRoute(path: '/patient/care', builder: (_, __) => const PatientCarePage()),
          GoRoute(path: '/patient/profile', builder: (_, __) => const PatientProfilePage()),
        ],
      ),
      GoRoute(path: '/patient/book', builder: (_, __) => const PatientBookFlowPage()),
      GoRoute(path: '/patient/tracking', builder: (_, __) => const PatientTrackingPage()),
      GoRoute(path: '/doctor/home', builder: (_, __) => const DoctorHomePage()),
      GoRoute(path: '/ops/home', builder: (_, __) => const OpsHomePage()),
    ],
    errorBuilder: (_, state) => Scaffold(
      body: Center(child: Text('Route not found: ${state.uri}')),
    ),
  );
}
