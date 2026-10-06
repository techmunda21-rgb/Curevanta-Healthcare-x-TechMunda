import 'package:flutter/material.dart';
import 'app/app.dart';
import 'core/auth/auth_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final auth = AuthService();
  await auth.bootstrap();
  runApp(CurevantaApp(auth: auth));
}
