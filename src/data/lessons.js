export const lessons = [
  // L1 — Journey Through the Solar System
  {
    id: 'lesson-solar',
    version: 1.1,
    title: 'Journey Through the Solar System',
    description: 'A fun and interactive journey through the planets in our solar system.',
    subject: 'Science',
    gradeLevel: '2-4',
    author: 'Dr. Astro',
    coverImage: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=800',
    defaultLanguage: 'en',
    scenes: [
      {
        sceneId: 's1',
        sceneType: 'content',
        content: '<h1>Welcome, Space Explorer! 🚀</h1><p>Today, we will travel to the amazing planets in our solar system. Buckle up!</p>',
        branching: { onComplete: 's2' },
      },
      {
        sceneId: 's2',
        sceneType: 'video',
        content: '<p>First, let\'s watch a cool video about the Sun!</p>',
        interactiveElement: { source: 'youtube', videoId: '2HoTK_Gqi2Q' },
        branching: { onComplete: 's3' },
      },
      {
        sceneId: 's3',
        sceneType: 'multiple-choice-quiz',
        content: '<p>Time for a quick question!</p>',
        interactiveElement: {
          question: 'Which planet is closest to the Sun?',
          options: [
            { optionId: 'a', text: 'Venus' },
            { optionId: 'b', text: 'Earth' },
            { optionId: 'c', text: 'Mercury' },
          ],
          correctOptionId: 'c',
          enableConfidenceRating: true,
        },
        branching: { onComplete: 's4', rules: [{ condition: 'isCorrect == false', goto: 's3b' }] },
      },
      {
        sceneId: 's3b',
        sceneType: 'content',
        content: '<h2>Quick hint 🌡️</h2><p>It\'s small, very hot, and the FIRST planet from the Sun. Have another go!</p>',
        branching: { onComplete: 's4' },
      },
      {
        sceneId: 's4',
        sceneType: 'categorize-items',
        content: '<h2>Planet Types</h2><p>Drag (or tap) each planet into the correct category.</p>',
        interactiveElement: {
          categories: ['Terrestrial Planet', 'Gas Giant'],
          items: [
            { itemId: 'earth', text: 'Earth' },
            { itemId: 'jupiter', text: 'Jupiter' },
            { itemId: 'mars', text: 'Mars' },
            { itemId: 'saturn', text: 'Saturn' },
          ],
          correctCategorization: {
            earth: 'Terrestrial Planet',
            jupiter: 'Gas Giant',
            mars: 'Terrestrial Planet',
            saturn: 'Gas Giant',
          },
        },
        branching: { onComplete: 's5' },
      },
      {
        sceneId: 's5',
        sceneType: 'match-pairs',
        content: '<h2>Planet Facts</h2><p>Match each planet to its famous feature.</p>',
        interactiveElement: {
          pairs: [
            { itemId: 'A', text: 'Mars' },
            { itemId: 'B', text: 'Saturn' },
          ],
          matches: [
            { matchId: '1', text: 'Has beautiful rings' },
            { matchId: '2', text: 'The Red Planet' },
          ],
          correctMapping: { A: '2', B: '1' },
        },
        branching: { onComplete: 's6' },
      },
      {
        sceneId: 's6',
        sceneType: 'open-text-question',
        content: '<p>Think about what you\'ve learned.</p>',
        interactiveElement: {
          question: 'Why is Earth special compared to other planets?',
          suggestedKeywords: ['water', 'life', 'atmosphere', 'people'],
        },
        branching: { onComplete: 's7' },
      },
      {
        sceneId: 's7',
        sceneType: 'audio-response',
        content: '<h2>Your Turn! 🎤</h2><p>Use the microphone to answer out loud.</p>',
        interactiveElement: { question: 'Which planet is your favorite and why?' },
        branching: { onComplete: 's8' },
      },
      {
        sceneId: 's8',
        sceneType: 'content',
        content: '<h1>Amazing work, Explorer! 🌟</h1><p>You have successfully completed your mission across the solar system. Well done!</p>',
      },
    ],
  },

  // L2 — Word Wizards: Poetry & Vocabulary
  {
    id: 'lesson-words',
    version: 1.0,
    title: 'Word Wizards: Poetry & Vocabulary',
    description: 'Build your vocabulary with matching, sorting, and a drag-to-spell mini-game.',
    subject: 'Language Arts',
    gradeLevel: '3-5',
    author: 'Ms. Rivera',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800',
    defaultLanguage: 'en',
    scenes: [
      {
        sceneId: 'w1',
        sceneType: 'content',
        content: '<h1>Welcome, Word Wizard! 📖</h1><p>Today we grow your vocabulary with powerful words.</p>',
        branching: { onComplete: 'w2' },
      },
      {
        sceneId: 'w2',
        sceneType: 'multiple-choice-quiz',
        content: '<p>New word time!</p>',
        interactiveElement: {
          question: 'What does "luminous" mean?',
          options: [
            { optionId: 'a', text: 'Dim and dark' },
            { optionId: 'b', text: 'Full of light; bright' },
            { optionId: 'c', text: 'Wet and damp' },
          ],
          correctOptionId: 'b',
          enableConfidenceRating: true,
        },
        branching: { onComplete: 'w3' },
      },
      {
        sceneId: 'w3',
        sceneType: 'match-pairs',
        content: '<h2>Match the Synonyms</h2><p>Connect each word to its meaning.</p>',
        interactiveElement: {
          pairs: [
            { itemId: 'A', text: 'Rapid' },
            { itemId: 'B', text: 'Gigantic' },
            { itemId: 'C', text: 'Fragile' },
          ],
          matches: [
            { matchId: '1', text: 'Huge' },
            { matchId: '2', text: 'Fast' },
            { matchId: '3', text: 'Easily broken' },
          ],
          correctMapping: { A: '2', B: '1', C: '3' },
        },
        branching: { onComplete: 'w4' },
      },
      {
        sceneId: 'w4',
        sceneType: 'categorize-items',
        content: '<h2>Word Sort</h2><p>Sort each word into its part of speech.</p>',
        interactiveElement: {
          categories: ['Noun', 'Verb', 'Adjective'],
          items: [
            { itemId: 'run', text: 'run' },
            { itemId: 'ocean', text: 'ocean' },
            { itemId: 'happy', text: 'happy' },
          ],
          correctCategorization: { run: 'Verb', ocean: 'Noun', happy: 'Adjective' },
        },
        branching: { onComplete: 'w5' },
      },
      {
        sceneId: 'w5',
        sceneType: 'open-text-question',
        content: '<p>Your turn to write!</p>',
        interactiveElement: {
          question: 'Write one sentence using the word "luminous".',
          suggestedKeywords: ['luminous', 'moon', 'light', 'bright'],
        },
        branching: { onComplete: 'w6' },
      },
      {
        sceneId: 'w6',
        sceneType: 'custom-interactive',
        content: '<h2>Build the Word! 🔤</h2><p>Drag the letters to spell the secret word.</p>',
        interactiveElement: {
          embedUrl: '/games/word-builder/index.html',
          config: { target: 'STAR', letters: ['S', 'T', 'A', 'R', 'X', 'O'] },
        },
        branching: { onComplete: 'w7' },
      },
      {
        sceneId: 'w7',
        sceneType: 'content',
        content: '<h1>Spellbinding work! ✨</h1><p>You\'ve mastered today\'s words. See you next time, Word Wizard!</p>',
      },
    ],
  },

  // L3 — Math Quest: Fractions & Logic
  {
    id: 'lesson-math',
    version: 1.0,
    title: 'Math Quest: Fractions & Logic',
    description: 'Master fractions with adaptive hints that branch when you get stuck.',
    subject: 'Math',
    gradeLevel: '4-6',
    author: 'Mr. Phi',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    defaultLanguage: 'en',
    scenes: [
      {
        sceneId: 'm1',
        sceneType: 'content',
        content: '<h1>Math Quest Begins! ➗</h1><p>Today we conquer fractions. Stay sharp!</p>',
        branching: { onComplete: 'm2' },
      },
      {
        sceneId: 'm2',
        sceneType: 'video',
        content: '<p>Let\'s start with a quick refresher.</p>',
        interactiveElement: { source: 'youtube', videoId: '2HoTK_Gqi2Q' },
        branching: { onComplete: 'm3' },
      },
      {
        sceneId: 'm3',
        sceneType: 'multiple-choice-quiz',
        content: '<p>Warm-up question!</p>',
        interactiveElement: {
          question: 'Which is bigger: 1/2 or 1/4?',
          options: [
            { optionId: 'a', text: '1/4' },
            { optionId: 'b', text: '1/2' },
            { optionId: 'c', text: 'They are the same' },
          ],
          correctOptionId: 'b',
          enableConfidenceRating: true,
        },
        branching: { onComplete: 'm4', rules: [{ condition: 'isCorrect == false', goto: 'm3b' }] },
      },
      {
        sceneId: 'm3b',
        sceneType: 'content',
        content: '<h2>Hint 🍕</h2><p>A bigger denominator means SMALLER slices! So 1/2 is bigger than 1/4.</p>',
        branching: { onComplete: 'm4' },
      },
      {
        sceneId: 'm4',
        sceneType: 'match-pairs',
        content: '<h2>Equivalent Fractions</h2><p>Match each fraction to an equal fraction.</p>',
        interactiveElement: {
          pairs: [
            { itemId: 'A', text: '1/2' },
            { itemId: 'B', text: '1/3' },
            { itemId: 'C', text: '3/4' },
          ],
          matches: [
            { matchId: '1', text: '3/9' },
            { matchId: '2', text: '2/4' },
            { matchId: '3', text: '6/8' },
          ],
          correctMapping: { A: '2', B: '1', C: '3' },
        },
        branching: { onComplete: 'm5' },
      },
      {
        sceneId: 'm5',
        sceneType: 'categorize-items',
        content: '<h2>Sort the Fractions</h2><p>Is each fraction less than or greater than 1/2?</p>',
        interactiveElement: {
          categories: ['Less than 1/2', 'Greater than 1/2'],
          items: [
            { itemId: 'threefourths', text: '3/4' },
            { itemId: 'onefourth', text: '1/4' },
            { itemId: 'twofifths', text: '2/5' },
            { itemId: 'fourfifths', text: '4/5' },
          ],
          correctCategorization: {
            threefourths: 'Greater than 1/2',
            onefourth: 'Less than 1/2',
            twofifths: 'Less than 1/2',
            fourfifths: 'Greater than 1/2',
          },
        },
        branching: { onComplete: 'm6' },
      },
      {
        sceneId: 'm6',
        sceneType: 'open-text-question',
        content: '<p>Explain your thinking.</p>',
        interactiveElement: {
          question: 'Explain how you know that 3/4 is bigger than 1/4.',
          suggestedKeywords: ['pieces', 'denominator', 'bigger', 'fourths', 'slices'],
        },
        branching: { onComplete: 'm7' },
      },
      {
        sceneId: 'm7',
        sceneType: 'content',
        content: '<h1>Fraction Champion! 🏆</h1><p>You solved every challenge. Incredible math thinking!</p>',
      },
    ],
  },
]
