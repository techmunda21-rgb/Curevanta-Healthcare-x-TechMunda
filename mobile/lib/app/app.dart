import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../core/auth/auth_service.dart';
import 'router.dart';
import 'theme.dart';

class CurevantaApp extends StatefulWidget {
  const CurevantaApp({super.key, required this.auth});

  final AuthService auth;

  @override
  State<CurevantaApp> createState() => _CurevantaAppState();
}

class _CurevantaAppState extends State<CurevantaApp> {
  late final GoRouter router = createRouter(widget.auth);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: widget.auth,
      child: MaterialApp.router(
        title: 'Curevanta',
        debugShowCheckedModeBanner: false,
        theme: buildAppTheme(),
        routerConfig: router,
      ),
    );
  }
}
