export interface DailyTarget {
  title: string;
  subtitle?: string; // ✅ Add this line
  generatedFor: string;
  description: string;
  focusArea: string;
  motivation: string;
}
