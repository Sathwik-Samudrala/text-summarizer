const SENTIMENT_ICONS = {
  positive: '✅',
  neutral: '➖',
  negative: '❌',
};

export function printResult({ summary, keyPoints, sentiment }) {
  const divider = '─'.repeat(50);

  console.log(divider);
  console.log('📝 Summary:');
  console.log(`   ${summary}`);
  console.log('');
  console.log('🔑 Key Points:');
  keyPoints.forEach((point, i) => {
    console.log(`   ${i + 1}. ${point}`);
  });
  console.log('');
  const icon = SENTIMENT_ICONS[sentiment] ?? '❓';
  console.log(`💬 Sentiment: ${icon} ${sentiment}`);
  console.log(divider);
  console.log('');
}