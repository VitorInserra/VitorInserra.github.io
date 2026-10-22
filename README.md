# Personal website

A ReactJS personal website inspired by the layout, transitions, and EEG backdrop of [EEGo Lab](https://eego-unc.github.io/Lab/#home), using its [GitHub repository](https://github.com/EEGo-UNC/Lab) as the reference.

## Start locally

Use Node.js 22.12 or newer (Node 24 LTS is a good choice).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For a production build:

```sh
npm run build
npm run preview
```

## Personalize

Start with **`src/data/site.js`**. It contains your name, initials, introduction, description, interests, optional email/social links, projects, publications, and opinions.

- Replace the `Your Name` and `YN` placeholders.
- Replace the description paragraphs with your biography.
- Replace starter entries with your work, then set `example: false`.
- Add project and publication URLs to show their external links.
- Add opinion paragraphs in each entry’s `body` array. Entries open in an accessible reader dialog.
- Add social links to `profile.links`, and optionally set `profile.email`.
- Update `index.html` for your page description and default title. Runtime titles use `profile.name`.

No personal biography, research output, or opinion has been invented. Every illustrative entry is labeled **Starter entry**. Contact links remain hidden until configured.

## Pages

| URL hash | Content |
| --- | --- |
| `#home` | Name with animated EEG waves, description, selected work, section links |
| `#description` | Direct link to the home description section |
| `#projects` | Filterable project collection and details |
| `#publications` | Papers and presentations, filters, abstracts |
| `#opinions` | Opinion collection and reading dialogs |

Browser back/forward and direct links work without a server-side route configuration. Assets use relative paths, including for repository-hosted GitHub Pages.

## Motion and accessibility

- GSAP 3.13.0 + ScrollTrigger: character entrances, page fades, card reveals, visual wipes, parallax, and a quote that lights up while scrolling.
- Lenis 1.3.11: desktop smooth scrolling with the reference’s `lerp: 0.12`.
- Canvas EEG backdrop: seeded signals using the reference hero’s palette, frequencies, amplitudes, and speed.
- Motion and observers are disposed when components unmount; wave rendering pauses offscreen and in background tabs.
- OS reduced-motion preferences are respected and update live. Add `?motion=reduced` before the hash to force the static version.
- Native modal dialogs provide focus containment, Escape dismissal, and focus restoration.
- Keyboard focus styles, a skip link, navigation announcements, and accessible mobile controls are included.
- Theme preference is saved locally when browser storage is available.

## Structure

```text
src/
  App.jsx                    Pages, hash navigation, layout
  styles.css                 Responsive styles and theme tokens
  data/site.js               Editable profile and content
  components/
    EEGWaveform.jsx          Seeded canvas EEG backdrop
    ProjectVisual.jsx        Native SVG project illustrations
    DetailDialog.jsx         Project, publication, and opinion reader
    Icon.jsx                 Small SVG icon set
  hooks/
    usePageMotion.js         GSAP lifecycle and reference animation timings
    useReducedMotion.js      Live accessibility preference
```

## Deploy to GitHub Pages

Create an empty GitHub repository, then push this local repository to it:

```sh
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

In your GitHub repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**. If the first workflow ran before Pages was enabled, rerun it from the Actions tab.

The included workflow builds pull requests and deploys pushes to `main`. You can also run it manually from the Actions tab. It uploads `dist/` and publishes it with GitHub’s Pages actions, following the [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages).

The Vite configuration uses `base: './'`, so built assets work at both `https://YOUR_USERNAME.github.io/` and `https://YOUR_USERNAME.github.io/YOUR_REPO/`. Hash navigation keeps all four pages under the same base path. No repository name needs to be hardcoded.

See [REFERENCE.md](REFERENCE.md) for the exact reference commit and implementation notes.
