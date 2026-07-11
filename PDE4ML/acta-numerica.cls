% Submission-oriented Acta Numerica / Cambridge article class.
% Acta Numerica currently accepts standard LaTeX and does not publish a
% journal-specific class. This class follows the interface and restrained
% single-column layout of Cambridge's official medium journal template.
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{acta-numerica}[2026/07/11 v1.0 PDE4ML Acta Numerica submission class]

\LoadClass[10pt,a4paper,twoside]{article}

\RequirePackage[T1]{fontenc}
\RequirePackage[a4paper,inner=29mm,outer=24mm,top=27mm,bottom=30mm,headheight=14pt,headsep=7mm]{geometry}
\RequirePackage{newtxtext}
\RequirePackage[scaled=.92]{helvet}
\RequirePackage{microtype}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{xcolor}
\RequirePackage[authoryear,round]{natbib}

\definecolor{anrule}{gray}{0.58}

\makeatletter
\newcommand{\an@affiliation}{}
\newcommand{\an@email}{}
\newcommand{\an@keywords}{}
\newcommand{\an@shorttitle}{PDEs for machine learning}
\newcommand{\an@shortauthor}{G. Peyr\'e}
\newcommand{\affiliation}[1]{\gdef\an@affiliation{#1}}
\newcommand{\email}[1]{\gdef\an@email{#1}}
\newcommand{\keywords}[1]{\gdef\an@keywords{#1}}
\newcommand{\shorttitle}[1]{\gdef\an@shorttitle{#1}}
\newcommand{\shortauthor}[1]{\gdef\an@shortauthor{#1}}

\renewcommand{\maketitle}{%
  \thispagestyle{empty}%
  \begingroup
  \centering
  \vspace*{1.2em}%
  {\Large\bfseries \@title\par}%
  \vspace{1.15em}%
  {\large \@author\par}%
  \vspace{.4em}%
  {\small\itshape \an@affiliation\par}%
  \ifx\an@email\@empty\else
    \vspace{.2em}{\small\ttfamily \an@email\par}%
  \fi
  \vspace{1.2em}%
  {\color{anrule}\rule{\textwidth}{.45pt}\par}%
  \endgroup
}

\renewenvironment{abstract}{%
  \begin{center}\begin{minipage}{.91\textwidth}
  \small\noindent\textbf{Abstract.}\enspace
}{%
  \par\end{minipage}\end{center}
  \ifx\an@keywords\@empty\else
    \begin{center}\begin{minipage}{.91\textwidth}
    \small\noindent\textbf{Keywords.}\enspace\an@keywords
    \end{minipage}\end{center}
  \fi
  \vspace{.7em}
}

\titleformat{\section}
  {\normalfont\Large\bfseries}
  {\thesection.}{.55em}{}
\titleformat{name=\section,numberless}
  {\normalfont\Large\bfseries}
  {}{0pt}{}
\titleformat{\subsection}
  {\normalfont\large\bfseries}
  {\thesubsection.}{.5em}{}
\titleformat{\subsubsection}
  {\normalfont\normalsize\bfseries}
  {\thesubsubsection.}{.45em}{}
\titleformat{\paragraph}[runin]
  {\normalfont\bfseries}
  {}{0pt}{}
\titlespacing*{\section}{0pt}{2.6ex plus .7ex minus .3ex}{1.1ex plus .2ex}
\titlespacing*{\subsection}{0pt}{2.1ex plus .5ex minus .2ex}{.8ex plus .15ex}
\titlespacing*{\subsubsection}{0pt}{1.7ex plus .4ex minus .2ex}{.6ex plus .1ex}
\titlespacing*{\paragraph}{0pt}{1.35ex plus .35ex minus .1ex}{.55em}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[LE]{\small\itshape\an@shortauthor}
\fancyhead[RO]{\small\itshape\an@shorttitle}
\fancyhead[LO,RE]{\small\thepage}
\renewcommand{\headrulewidth}{.3pt}
\fancypagestyle{plain}{%
  \fancyhf{}%
  \fancyhead[LE,RO]{\small\thepage}%
  \renewcommand{\headrulewidth}{0pt}%
}
\makeatother

\setcounter{tocdepth}{2}
\setcounter{secnumdepth}{3}
\setlength{\parindent}{1.2em}
\setlength{\parskip}{0pt}
