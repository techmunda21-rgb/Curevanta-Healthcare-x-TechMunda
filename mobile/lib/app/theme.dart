import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CvColors {
  static const primary = Color(0xFF009B9A);
  static const primaryPressed = Color(0xFF007A7A);
  static const primarySoft = Color(0xFFE6F5F5);
  static const accent = Color(0xFF48D7D2);
  static const background = Color(0xFFF7FAFA);
  static const surface = Color(0xFFFFFFFF);
  static const textPrimary = Color(0xFF30363A);
  static const textSecondary = Color(0xFF5C6569);
  static const textMuted = Color(0xFF6B7578);
  static const border = Color(0xFFD7E0E0);
  static const success = Color(0xFF1B7F5A);
  static const warning = Color(0xFFB7791F);
  static const error = Color(0xFFC62828);
  static const ops = Color(0xFF30363A);
}

ThemeData buildAppTheme() {
  final text = GoogleFonts.plusJakartaSansTextTheme();
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: CvColors.primary,
      primary: CvColors.primary,
      surface: CvColors.surface,
      error: CvColors.error,
    ),
    scaffoldBackgroundColor: CvColors.background,
    textTheme: text.apply(
      bodyColor: CvColors.textPrimary,
      displayColor: CvColors.textPrimary,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true,
      foregroundColor: CvColors.textPrimary,
      titleTextStyle: GoogleFonts.plusJakartaSans(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        color: CvColors.textPrimary,
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: CvColors.primary,
        foregroundColor: Colors.white,
        minimumSize: const Size.fromHeight(52),
        shape: const StadiumBorder(),
        textStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: CvColors.primary,
        side: const BorderSide(color: CvColors.primary, width: 2),
        minimumSize: const Size.fromHeight(52),
        shape: const StadiumBorder(),
        textStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: CvColors.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: CvColors.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: CvColors.primary, width: 1.6),
      ),
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(color: CvColors.border),
      ),
    ),
  );
}
