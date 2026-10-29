import { API_BASE } from "./api";

export interface FaqItem {
  id: number | string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  label: string;
  items: FaqItem[];
}

type RawFaq = Partial<FaqItem> & { category?: string | null };

/** A flat list grouped by its `category` field, in first-seen order. */
function groupByCategory(list: RawFaq[]) {
  return list.reduce<Record<string, RawFaq[]>>((groups, faq) => {
    (groups[faq.category?.trim() || "General"] ??= []).push(faq);
    return groups;
  }, {});
}

/**
 * FAQs by category, in the order GET /faqs lists them. The API answers
 * `{ faqs: { [category]: FaqItem[] } }`; a flat list with a `category` field is grouped too.
 * Categories with no answered question are dropped.
 */
export async function getFaqs(): Promise<FaqCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/faqs`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[getFaqs] API responded with ${res.status}.`);
      return [];
    }

    const data = await res.json();
    const raw = data?.faqs ?? data?.data ?? data;
    const groups: Record<string, RawFaq[]> = Array.isArray(raw) ? groupByCategory(raw) : (raw ?? {});

    return Object.entries(groups)
      .map(([label, items]) => ({
        label,
        items: (Array.isArray(items) ? items : [])
          .filter((f) => f.question?.trim() && f.answer?.trim())
          .map((f, i) => ({ id: f.id ?? `${label}-${i}`, question: f.question!.trim(), answer: f.answer!.trim() })),
      }))
      .filter((c) => c.items.length > 0);
  } catch (error) {
    console.error("[getFaqs] Fetch error from API:", error);
    return [];
  }
}
