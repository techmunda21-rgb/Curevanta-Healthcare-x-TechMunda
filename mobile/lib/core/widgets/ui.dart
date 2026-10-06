import 'package:flutter/material.dart';
import '../../app/theme.dart';

class CvLogo extends StatelessWidget {
  const CvLogo({super.key, this.size = 64, this.color = CvColors.primary});
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Icon(Icons.add_rounded, color: Colors.white, size: size * 0.5),
    );
  }
}

class CvButton extends StatelessWidget {
  const CvButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.outlined = false,
    this.color,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool outlined;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    if (outlined) {
      return OutlinedButton(
        onPressed: onPressed,
        style: color == null
            ? null
            : OutlinedButton.styleFrom(
                foregroundColor: color,
                side: BorderSide(color: color!, width: 2),
              ),
        child: Text(label),
      );
    }
    return FilledButton(
      onPressed: onPressed,
      style: color == null
          ? null
          : FilledButton.styleFrom(backgroundColor: color),
      child: Text(label),
    );
  }
}

class PortalLoginForm extends StatefulWidget {
  const PortalLoginForm({
    super.key,
    required this.title,
    required this.subtitle,
    required this.demoEmail,
    required this.demoPassword,
    required this.accent,
    required this.onSubmit,
    required this.onBack,
  });

  final String title;
  final String subtitle;
  final String demoEmail;
  final String demoPassword;
  final Color accent;
  final Future<String?> Function(String email, String password) onSubmit;
  final VoidCallback onBack;

  @override
  State<PortalLoginForm> createState() => _PortalLoginFormState();
}

class _PortalLoginFormState extends State<PortalLoginForm> {
  late final emailCtrl = TextEditingController(text: widget.demoEmail);
  late final passCtrl = TextEditingController(text: widget.demoPassword);
  bool loading = false;
  String? error;
  bool obscure = true;

  @override
  void dispose() {
    emailCtrl.dispose();
    passCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      loading = true;
      error = null;
    });
    final err = await widget.onSubmit(emailCtrl.text, passCtrl.text);
    if (!mounted) return;
    setState(() {
      loading = false;
      error = err;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: CvColors.background,
      appBar: AppBar(
        leading: IconButton(
          onPressed: widget.onBack,
          icon: const Icon(Icons.arrow_back_rounded),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 440),
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                CvLogo(color: widget.accent),
                const SizedBox(height: 18),
                Text(
                  widget.title,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.w900,
                      ),
                ),
                const SizedBox(height: 6),
                Text(
                  widget.subtitle,
                  style: const TextStyle(color: CvColors.textSecondary),
                ),
                const SizedBox(height: 22),
                TextField(
                  controller: emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'Email'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: passCtrl,
                  obscureText: obscure,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    suffixIcon: IconButton(
                      onPressed: () => setState(() => obscure = !obscure),
                      icon: Icon(obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                    ),
                  ),
                ),
                if (error != null) ...[
                  const SizedBox(height: 12),
                  Text(error!, style: TextStyle(color: CvColors.error, fontWeight: FontWeight.w600)),
                ],
                const SizedBox(height: 18),
                CvButton(
                  label: loading ? 'Signing in…' : 'Sign in',
                  color: widget.accent,
                  onPressed: loading ? null : _submit,
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: widget.accent.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(
                    'Demo: ${widget.demoEmail} / ${widget.demoPassword}',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: widget.accent,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
