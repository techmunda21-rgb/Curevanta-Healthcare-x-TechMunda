import 'package:flutter_test/flutter_test.dart';
import 'package:curevanta_app/app/app.dart';
import 'package:curevanta_app/core/auth/auth_service.dart';

void main() {
  testWidgets('Hub shows three portals', (tester) async {
    final auth = AuthService();
    await auth.bootstrap();
    await tester.pumpWidget(CurevantaApp(auth: auth));
    await tester.pumpAndSettle();
    expect(find.text('Patient App'), findsOneWidget);
    expect(find.text('Doctor App'), findsOneWidget);
    expect(find.textContaining('Ops'), findsOneWidget);
  });
}
