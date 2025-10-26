# Contributing to Astro SEO Blog Template

Thank you for your interest in contributing to the Astro SEO Blog Template! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node version, etc.)

### Suggesting Enhancements

We love new ideas! To suggest an enhancement:

1. Check if the feature has already been suggested
2. Create an issue describing your idea
3. Explain why this enhancement would be useful
4. Provide examples of how it would work

### Pull Requests

We actively welcome your pull requests:

1. **Fork the repo** and create your branch from `main`
2. **Make your changes**
   - Write clear, commented code
   - Follow the existing code style
   - Add tests if applicable
3. **Test your changes**
   - Run `npm run build` to ensure the project builds
   - Test in development mode with `npm run dev`
   - Check for TypeScript errors
4. **Update documentation**
   - Update the README if needed
   - Add comments to complex code
5. **Commit your changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format (optional but recommended)
6. **Push to your fork** and submit a pull request

## Development Setup

1. Fork and clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/astro-seo-blog-template.git
   cd astro-seo-blog-template
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Make your changes and test thoroughly

## Code Style

- Use TypeScript for type safety
- Follow the existing code formatting
- Use meaningful variable and function names
- Comment complex logic
- Keep functions small and focused

## Project Structure

```
/
├── public/              # Static assets and blog content
│   ├── data/           # Blog posts, authors, categories, tags
│   └── blog-images/    # Blog post images
├── src/
│   ├── components/     # Reusable components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── lib/            # Utilities and helpers
│   └── config/         # Configuration files
└── package.json
```

## Testing

Before submitting a PR:

- Run `npm run build` to ensure the project builds successfully
- Test the site in both light and dark modes
- Check responsive design on different screen sizes
- Verify SEO tags are working correctly
- Test any new features thoroughly

## Commit Messages

We recommend using conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add search functionality to blog posts`

## Questions?

Feel free to create an issue if you have any questions about contributing!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!
