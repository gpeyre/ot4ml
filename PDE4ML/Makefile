TEX = PDE4ML
LATEX = pdflatex -interaction=nonstopmode -halt-on-error

.PHONY: all pdf clean distclean

all: pdf

pdf:
	$(LATEX) $(TEX).tex
	bibtex $(TEX)
	$(LATEX) $(TEX).tex
	$(LATEX) $(TEX).tex

clean:
	rm -f $(TEX).aux $(TEX).bbl $(TEX).blg $(TEX).idx $(TEX).ilg $(TEX).ind
	rm -f $(TEX).log $(TEX).out $(TEX).toc $(TEX).synctex.gz

distclean: clean
	rm -f $(TEX).pdf
