export const splitTextIntoChunks = (
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): string[] => {
  const chunks: string[] = [];

  // Clean up excessive whitespace and newlines
  const cleanedText = text.replace(/\s+/g, " ").trim();
  const words = cleanedText.split(" ");

  let currentChunk: string[] = [];
  let currentLength = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentChunk.push(word);
    currentLength += word.length + 1; // +1 for space

    if (currentLength >= chunkSize) {
      chunks.push(currentChunk.join(" ").trim());
      const overlapWords: string[] = [];
      let overlapLength = 0;

      for (let j = currentChunk.length - 1; j >= 0; j--) {
        overlapWords.unshift(currentChunk[j]); // include the word first
        overlapLength += currentChunk[j].length + 1;
        if (overlapLength >= overlap) break;   // then decide to stop
      }

      currentChunk = overlapWords;
      currentLength = overlapWords.join(" ").length;
    }
  }

  // Push remaining words as the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" ").trim());
  }

  return chunks.filter((chunk) => chunk.length > 0);
};