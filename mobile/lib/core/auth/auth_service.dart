import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_models.dart';

/// Session store — one active role at a time (sub-app isolation).
class AuthService extends ChangeNotifier {
  AuthService();

  static const _kRole = 'cv_role';
  static const _kEmail = 'cv_email';
  static const _kName = 'cv_name';
  static const _kId = 'cv_id';

  AppUser? _user;
  bool _ready = false;

  AppUser? get user => _user;
  bool get isReady => _ready;
  bool get isLoggedIn => _user != null;
  AppRole? get role => _user?.role;

  Future<void> bootstrap() async {
    final prefs = await SharedPreferences.getInstance();
    final roleName = prefs.getString(_kRole);
    final email = prefs.getString(_kEmail);
    final name = prefs.getString(_kName);
    final id = prefs.getString(_kId);
    if (roleName != null && email != null && name != null && id != null) {
      final role = AppRole.values.firstWhere(
        (r) => r.name == roleName,
        orElse: () => AppRole.patient,
      );
      _user = AppUser(id: id, name: name, email: email, role: role);
    }
    _ready = true;
    notifyListeners();
  }

  Future<String?> login({
    required AppRole portal,
    required String email,
    required String password,
  }) async {
    final user = SeedAccounts.authenticate(
      portal: portal,
      email: email,
      password: password,
    );
    if (user == null) {
      return 'Invalid ${portal.label} credentials for this portal.';
    }
    // Hard isolation: replace any previous session
    _user = user;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kRole, user.role.name);
    await prefs.setString(_kEmail, user.email);
    await prefs.setString(_kName, user.name);
    await prefs.setString(_kId, user.id);
    notifyListeners();
    return null;
  }

  Future<void> logout() async {
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kRole);
    await prefs.remove(_kEmail);
    await prefs.remove(_kName);
    await prefs.remove(_kId);
    notifyListeners();
  }

  bool canAccess(AppRole required) => _user?.role == required;
}
