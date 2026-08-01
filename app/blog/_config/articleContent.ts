export interface ArticleSection {
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'code' | 'callout' | 'image' | 'quote' | 'divider' | 'steps';
  content?: string;
  items?: string[];
  language?: string;
  variant?: 'info' | 'success' | 'warning' | 'tip';
  title?: string;
  steps?: { title: string; description: string }[];
}

export interface ArticleContent {
  slug: string;
  intro: string;
  tableOfContents: { id: string; title: string }[];
  sections: ArticleSection[];
  faqs?: { question: string; answer: string }[];
}

// ============ ARTICLE CONTENT ============

export const articleContents: Record<string, ArticleContent> = {
  'how-to-merge-pdf-files': {
    slug: 'how-to-merge-pdf-files',
    intro: 'Merging PDF files is one of the most common PDF tasks. Whether you\'re combining multiple invoices, joining chapters of a book, or consolidating reports, this guide will show you the easiest and fastest ways to merge PDFs in 2025.',
    tableOfContents: [
      { id: 'what-is-pdf-merging', title: 'What is PDF Merging?' },
      { id: 'why-merge-pdfs', title: 'Why Merge PDFs?' },
      { id: 'how-to-merge', title: 'How to Merge PDFs (Step-by-Step)' },
      { id: 'best-practices', title: 'Best Practices' },
      { id: 'common-issues', title: 'Common Issues & Solutions' },
      { id: 'conclusion', title: 'Conclusion' },
    ],
    sections: [
      {
        type: 'heading',
        content: 'What is PDF Merging?',
      },
      {
        type: 'paragraph',
        content: 'PDF merging is the process of combining two or more PDF files into a single document. Instead of having multiple separate PDFs, you get one unified file that\'s easier to share, print, and organize.',
      },
      {
        type: 'paragraph',
        content: 'For example, if you have three separate PDFs for chapters of a report, merging them creates one complete report document.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Quick Fact',
        content: 'Merging PDFs doesn\'t change the content of individual files—it simply combines them in the order you choose while preserving quality.',
      },
      {
        type: 'heading',
        content: 'Why Merge PDFs?',
      },
      {
        type: 'paragraph',
        content: 'There are many reasons why you might want to combine multiple PDF files:',
      },
      {
        type: 'list',
        items: [
          '📧 Easier email sharing — one attachment instead of many',
          '📂 Better organization — related documents stay together',
          '🖨️ Simpler printing — print everything at once',
          '📱 Convenient reading — no need to switch between files',
          '💼 Professional presentation — organized proposals and reports',
          '📚 Document consolidation — combine chapters, sections, or parts',
        ],
      },
      {
        type: 'heading',
        content: 'How to Merge PDFs (Step-by-Step)',
      },
      {
        type: 'paragraph',
        content: 'Follow these simple steps to merge your PDF files using PDF Core—100% free with no signup required.',
      },
      {
        type: 'steps',
        steps: [
          {
            title: 'Open the Merge PDF Tool',
            description: 'Go to our Merge PDF tool. The interface is clean and simple—no ads, no distractions.',
          },
          {
            title: 'Upload Your PDF Files',
            description: 'Click "Choose PDFs" or drag and drop your files into the upload area. You can select multiple files at once.',
          },
          {
            title: 'Arrange the Order',
            description: 'Drag and drop the PDFs to reorder them. The order in the list is the order they\'ll appear in your final PDF.',
          },
          {
            title: 'Click Merge',
            description: 'Once you\'re happy with the order, click the "Merge PDF" button. Your files are processed instantly in your browser.',
          },
          {
            title: 'Download Your File',
            description: 'The merged PDF downloads automatically. That\'s it! No watermarks, no limits, no signup.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'success',
        title: '🔒 Privacy First',
        content: 'All merging happens in your browser. Your PDF files are never uploaded to our servers—your data stays 100% private.',
      },
      {
        type: 'heading',
        content: 'Best Practices for Merging PDFs',
      },
      {
        type: 'subheading',
        content: '1. Name Your Files Clearly',
      },
      {
        type: 'paragraph',
        content: 'Before merging, rename your files with clear, sequential names like "Chapter1.pdf", "Chapter2.pdf", etc. This makes it easier to arrange them in the correct order.',
      },
      {
        type: 'subheading',
        content: '2. Check File Quality First',
      },
      {
        type: 'paragraph',
        content: 'Open each PDF individually to ensure they\'re not corrupted and the content is what you expect. This saves time by catching issues before merging.',
      },
      {
        type: 'subheading',
        content: '3. Consider File Size',
      },
      {
        type: 'paragraph',
        content: 'Large merged PDFs can be slow to open and share. If your final file exceeds 25MB, consider compressing it afterward using our Compress PDF tool.',
      },
      {
        type: 'subheading',
        content: '4. Preserve Bookmarks',
      },
      {
        type: 'paragraph',
        content: 'If your original PDFs have bookmarks or table of contents, they\'ll be preserved in the merged file, making navigation easier.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: '💡 Pro Tip',
        content: 'You can merge unlimited PDF files at once. There\'s no limit on the number of files or total pages you can combine.',
      },
      {
        type: 'heading',
        content: 'Common Issues & Solutions',
      },
      {
        type: 'subheading',
        content: 'Problem: Files won\'t upload',
      },
      {
        type: 'paragraph',
        content: 'Make sure your files are actual PDFs (not PDFs saved as .doc or .jpg). Try refreshing the page and uploading again.',
      },
      {
        type: 'subheading',
        content: 'Problem: The merged file is too large',
      },
      {
        type: 'paragraph',
        content: 'After merging, use our Compress PDF tool to reduce the file size by up to 80% without losing quality.',
      },
      {
        type: 'subheading',
        content: 'Problem: Password-protected PDFs won\'t merge',
      },
      {
        type: 'paragraph',
        content: 'You\'ll need to unlock password-protected PDFs first using our Unlock PDF tool, then merge them.',
      },
      {
        type: 'subheading',
        content: 'Problem: Pages are in wrong order',
      },
      {
        type: 'paragraph',
        content: 'Simply drag and drop the file tiles to rearrange them before clicking merge. The order shown is the final order.',
      },
      {
        type: 'heading',
        content: 'Conclusion',
      },
      {
        type: 'paragraph',
        content: 'Merging PDFs is a simple but powerful way to organize your documents. With PDF Core, you can combine unlimited PDF files in seconds—for free, without signup, and with complete privacy.',
      },
      {
        type: 'paragraph',
        content: 'Ready to give it a try? Our Merge PDF tool is waiting for you. No downloads, no accounts, just fast, secure PDF merging in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Is it free to merge PDFs?',
        answer: 'Yes! PDF Core\'s Merge PDF tool is 100% free with no hidden costs, watermarks, or premium features. Merge as many PDFs as you want, as often as you want.',
      },
      {
        question: 'Is there a limit on file size?',
        answer: 'There\'s no strict file size limit. Since processing happens in your browser, the limit depends on your device\'s memory. Most devices can handle merging files up to 100MB+ without issues.',
      },
      {
        question: 'Are my files safe when merging?',
        answer: 'Absolutely. Your files never leave your device. All merging happens locally in your browser using JavaScript. We can\'t see, access, or store your PDFs.',
      },
      {
        question: 'Can I merge password-protected PDFs?',
        answer: 'You\'ll need to remove the password first using our Unlock PDF tool. Once unlocked, you can freely merge the files.',
      },
      {
        question: 'Does merging affect the quality of my PDFs?',
        answer: 'No. Merging preserves the original quality of each PDF. The text, images, and formatting remain exactly as they were in the source files.',
      },
      {
        question: 'Can I reorder pages after merging?',
        answer: 'Yes, but it\'s easier to arrange files in the correct order before merging. If you need to rearrange pages after, use our Organize PDF tool.',
      },
    ],
  },

  'how-to-compress-pdf': {
    slug: 'how-to-compress-pdf',
    intro: 'Large PDF files can be a hassle—slow to email, difficult to upload, and painful to share. This comprehensive guide shows you how to compress PDF files to reduce their size by up to 80% without sacrificing quality.',
    tableOfContents: [
      { id: 'why-compress', title: 'Why Compress PDFs?' },
      { id: 'how-compression-works', title: 'How PDF Compression Works' },
      { id: 'how-to-compress', title: 'How to Compress PDFs (Step-by-Step)' },
      { id: 'compression-levels', title: 'Choosing the Right Compression Level' },
      { id: 'tips', title: 'Tips for Best Results' },
      { id: 'conclusion', title: 'Conclusion' },
    ],
    sections: [
      {
        type: 'heading',
        content: 'Why Compress PDFs?',
      },
      {
        type: 'paragraph',
        content: 'PDF compression reduces file size while maintaining document quality. Here are the main reasons to compress your PDFs:',
      },
      {
        type: 'list',
        items: [
          '📧 Email attachments — Most email services limit attachments to 25MB',
          '⚡ Faster uploads — Smaller files upload quicker to any platform',
          '💾 Save storage space — Free up valuable disk space',
          '📱 Mobile-friendly — Easier to download and view on mobile devices',
          '🌐 Better website performance — Faster page loads',
          '☁️ Cloud storage savings — Store more files in the same space',
        ],
      },
      {
        type: 'heading',
        content: 'How PDF Compression Works',
      },
      {
        type: 'paragraph',
        content: 'PDF compression works by optimizing different elements within the document:',
      },
      {
        type: 'list',
        items: [
          '🖼️ Image optimization — Reducing image resolution and quality',
          '📝 Font subsetting — Including only used characters',
          '🗑️ Removing metadata — Stripping unnecessary information',
          '📦 Better encoding — Using more efficient compression algorithms',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Good to Know',
        content: 'Compression is most effective on PDFs with images. Text-only PDFs are already highly optimized.',
      },
      {
        type: 'heading',
        content: 'How to Compress PDFs (Step-by-Step)',
      },
      {
        type: 'steps',
        steps: [
          {
            title: 'Open Compress PDF Tool',
            description: 'Navigate to our Compress PDF tool. The interface is straightforward with no complicated options.',
          },
          {
            title: 'Upload Your PDF',
            description: 'Drag and drop your PDF file or click "Choose PDF" to select it from your device.',
          },
          {
            title: 'Select Compression Level',
            description: 'Choose Low, Medium, or High compression based on your needs. See our compression level guide below.',
          },
          {
            title: 'Wait for Processing',
            description: 'The compression happens in seconds, right in your browser. No file uploads to worry about.',
          },
          {
            title: 'Download Compressed PDF',
            description: 'Your smaller PDF downloads automatically. Compare the before and after sizes to see the savings!',
          },
        ],
      },
      {
        type: 'heading',
        content: 'Choosing the Right Compression Level',
      },
      {
        type: 'subheading',
        content: 'Low Compression (Recommended for most)',
      },
      {
        type: 'paragraph',
        content: 'Best for documents where quality matters. Reduces file size by 20-40% while maintaining excellent visual quality. Perfect for professional documents, contracts, and presentations.',
      },
      {
        type: 'subheading',
        content: 'Medium Compression',
      },
      {
        type: 'paragraph',
        content: 'A balanced choice for everyday use. Reduces file size by 40-60% with a slight quality reduction that\'s usually unnoticeable. Great for email attachments and general sharing.',
      },
      {
        type: 'subheading',
        content: 'High Compression',
      },
      {
        type: 'paragraph',
        content: 'Maximum size reduction of 60-80%. Some quality loss on images, but text remains crisp. Ideal for archiving or when file size is critical.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: '💡 Which Level Should You Choose?',
        content: 'Start with Medium compression for most cases. If quality is critical, use Low. If you need the smallest possible file, use High.',
      },
      {
        type: 'heading',
        content: 'Tips for Best Results',
      },
      {
        type: 'list',
        items: [
          '📸 If your PDF has many photos, expect greater size reduction',
          '📝 Text-heavy PDFs will compress less because text is already efficient',
          '🎨 Vector graphics (drawings) compress well without quality loss',
          '📊 Try different compression levels to find your best balance',
          '💾 Always keep your original PDF as backup',
          '⚡ Compression is instant—experiment freely!',
        ],
      },
      {
        type: 'heading',
        content: 'Conclusion',
      },
      {
        type: 'paragraph',
        content: 'PDF compression is essential for anyone who works with digital documents. Whether you\'re emailing invoices, uploading reports, or archiving files, compression saves time and storage space.',
      },
      {
        type: 'paragraph',
        content: 'Try our free Compress PDF tool now—process files instantly with complete privacy. No uploads to servers, no signup required, just fast compression right in your browser.',
      },
    ],
    faqs: [
      {
        question: 'How much can I compress a PDF?',
        answer: 'You can typically reduce PDF file size by 20-80% depending on the compression level and file content. PDFs with many images compress more than text-only PDFs.',
      },
      {
        question: 'Will compression lower the quality of my PDF?',
        answer: 'It depends on the compression level. Low compression maintains near-original quality, while High compression may show slight quality reduction on images. Text always remains crisp.',
      },
      {
        question: 'Is there a file size limit?',
        answer: 'There\'s no strict limit. Since compression happens in your browser, the limit depends on your device\'s memory. Most devices handle files up to 100MB+ easily.',
      },
      {
        question: 'Are my files safe when compressing?',
        answer: 'Yes! All compression happens locally in your browser. Your files never leave your device—we can\'t see, access, or store them.',
      },
      {
        question: 'Can I compress the same PDF multiple times?',
        answer: 'While technically possible, we don\'t recommend it. Each compression may reduce quality further. Instead, start with your original file and choose the right compression level.',
      },
    ],
  },
};

export function getArticleContent(slug: string): ArticleContent | undefined {
  return articleContents[slug];
}