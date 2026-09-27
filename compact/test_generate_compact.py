"""Regression checks for the compact-only editing and layout pipeline."""

import re
import tempfile
import unittest
from pathlib import Path

from editorial import HUNGARIAN_SENTENCE, OMITTED_TOPICS
from generate_compact import (
    LATEX,
    SECTION_NAMES,
    _scan_bracketed,
    compact_paragraph,
    compact_section,
    formula_context,
    inline_short_displays,
    parse_heading,
    polish_heading,
)


class CompactEditionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.chapters = {
            name: compact_section(LATEX / "sections" / f"{name}.tex")
            for name in SECTION_NAMES
        }

    def test_topic_cuts_and_hungarian_summary(self):
        for name, titles in OMITTED_TOPICS.items():
            headings = [parse_heading(line) for line in self.chapters[name].splitlines()]
            retained = {heading[1] for heading in headings if heading}
            self.assertFalse(titles & retained)
        self.assertEqual(self.chapters["matching"].count(HUNGARIAN_SENTENCE), 1)
        self.assertNotIn("prop-bobkov-ledoux-cdf-w2", self.chapters["monge"])
        self.assertIn("eq-wass-cumul", self.chapters["monge"])
        self.assertIn("eq-w1-1d", self.chapters["monge"])
        self.assertIn("prop-gaussian-w2-bures", self.chapters["monge"])

    def test_formula_introductions(self):
        self.assertIn("the number of non-crossing perfect matchings", self.chapters["matching"])
        for phrase in (
            "A Polish path space with its uniform metric is",
            "Gradients of convex functions are monotone:",
            "interpolate the quantiles:",
        ):
            self.assertIn(phrase, self.chapters["monge"])
        lines = ["The associated interpolation is given by"]
        self.assertEqual(formula_context(lines, compact_paragraph(lines)), lines)

    def test_numbered_displays_stay_numbered(self):
        equation = "\\eql{\\label{eq-test}\nx=y.\n}"
        self.assertEqual(inline_short_displays(equation), equation)
        catalan = "\\[\nC_n=\\frac1{n+1}\\binom{2n}{n}.\n\\]"
        self.assertEqual(inline_short_displays(catalan), catalan)

    def test_standalone_inline_formula_keeps_its_introduction(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "sample.tex"
            source.write_text(
                "\\chapter{Test}\n\\paragraph{Velocity}\n"
                "The associated velocity is\n"
                "\\(v(x)=-2x.\\)\n",
                encoding="utf-8",
            )
            text = compact_section(source)
        self.assertIn("The associated velocity is", text)
        self.assertIn(r"\(v(x)=-2x.\)", text)

    def test_heading_punctuation(self):
        self.assertEqual(
            polish_heading(r"\paragraph{\texorpdfstring{$\Wass_p$ costs.}{Wp costs}}"),
            r"\paragraph{\texorpdfstring{$\Wass_p$ costs.}{Wp costs}}",
        )

    def test_cross_references_resolve(self):
        text = "\n".join(self.chapters.values())
        labels = set(re.findall(r"\\label\{([^}]+)\}", text))
        for match in re.finditer(r"\\eqllead\{", text):
            _, pos = _scan_bracketed(text, match.end() - 1, "{", "}")
            label, _ = _scan_bracketed(text, pos, "{", "}")
            labels.add(label)
        refs = set(re.findall(r"\\(?:eqref|ref|pageref)\{([^}]+)\}", text))
        refs.update(re.findall(r"\\hyperref\[([^]]+)\]", text))
        self.assertFalse(refs - labels, f"Missing labels: {sorted(refs - labels)}")

    def test_no_empty_paragraph_headings(self):
        for name, text in self.chapters.items():
            self.assertNotRegex(
                text,
                r"\\paragraph[^\n]*\n\s*(?=\\(?:paragraph|subsection|section)\{|\Z)",
                name,
            )


if __name__ == "__main__":
    unittest.main()
