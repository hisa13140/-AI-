import { SlideItem, QuizQuestion } from '../types';

export function parseSlideMarkdown(markdown: string): SlideItem[] {
  const slides: SlideItem[] = [];
  if (!markdown) return slides;

  // Split by Slide headers: ### Slide 1: ... or ### Slide 1... or Slide 1...
  const slideRegex = /###?\s*(?:Slide|第\s*\d+\s*页|幻灯片\s*\d+)?\s*(\d+)?[：:\s]+([^\n]+)([\s\S]*?)(?=(?:###?\s*(?:Slide|第\s*\d+\s*页|幻灯片\s*\d+)?\s*\d+[：:\s]+)|$)/gi;
  
  let match;
  let index = 1;

  while ((match = slideRegex.exec(markdown)) !== null) {
    const rawNum = match[1] ? parseInt(match[1], 10) : index;
    const title = (match[2] || `幻灯片 ${index}`).trim();
    const body = match[3] || '';

    // Extract layout type
    const layoutMatch = body.match(/\*\*页面类型\*\*[：:\s]*([^\n]+)/i);
    const layoutRaw = layoutMatch ? layoutMatch[1].trim() : 'content';
    let layoutType: SlideItem['layoutType'] = 'content';
    if (layoutRaw.includes('封面') || index === 1) layoutType = 'cover';
    else if (layoutRaw.includes('活动') || layoutRaw.includes('互动') || layoutRaw.includes('研讨')) layoutType = 'activity';
    else if (layoutRaw.includes('总结') || layoutRaw.includes('小结') || layoutRaw.includes('作业')) layoutType = 'summary';

    // Extract key points
    const points: string[] = [];
    const pointsSection = body.match(/\*\*课件展示核心要点\*\*[：:\s]*([\s\S]*?)(?=\*\*教师说课|\*\*课堂互动|$)/i);
    if (pointsSection && pointsSection[1]) {
      const bulletLines = pointsSection[1].split('\n');
      for (const line of bulletLines) {
        const cleaned = line.replace(/^\s*[\*\-•\d\.]+\s*/, '').trim();
        if (cleaned.length > 0) points.push(cleaned);
      }
    }

    if (points.length === 0) {
      // Fallback: search for any bullet points in body
      const lines = body.split('\n');
      for (const line of lines) {
        if (/^\s*[\*\-•]\s+/.test(line)) {
          const cleaned = line.replace(/^\s*[\*\-•]\s*/, '').trim();
          if (cleaned.length > 0 && !cleaned.includes('页面类型') && !cleaned.includes('教师说课')) {
            points.push(cleaned);
          }
        }
      }
    }

    // Extract teacher notes
    const notesMatch = body.match(/\*\*教师说课讲义[\s\S]*?\*\*[：:\s]*([\s\S]*?)(?=\*\*课堂互动|###|$)/i);
    const teacherNotes = notesMatch ? notesMatch[1].trim() : '启发式引导学生思考，注重师生互动与思维生成。';

    // Extract interactive prompt
    const promptMatch = body.match(/\*\*课堂互动提问[\s\S]*?\*\*[：:\s]*([\s\S]*?)(?=###|$)/i);
    const interactivePrompt = promptMatch ? promptMatch[1].trim() : undefined;

    slides.push({
      id: index,
      slideNumber: rawNum || index,
      title,
      keyPoints: points.length > 0 ? points : ['探究核心知识', '理解关键概念', '巩固应用与实践'],
      teacherNotes,
      interactivePrompt,
      layoutType,
    });

    index++;
  }

  // Fallback if regex found 0 slides: split by major headers
  if (slides.length === 0) {
    const headers = markdown.split(/\n(?=##?\s+)/);
    let idx = 1;
    for (const h of headers) {
      if (!h.trim()) continue;
      const lines = h.trim().split('\n');
      const titleLine = lines[0].replace(/^#+\s*/, '').trim();
      const otherLines = lines.slice(1).join('\n');
      slides.push({
        id: idx,
        slideNumber: idx,
        title: titleLine || `第 ${idx} 页`,
        keyPoints: lines.slice(1, 5).map(l => l.replace(/^[\*\-\d\.\s]+/, '').trim()).filter(Boolean),
        teacherNotes: otherLines.substring(0, 200) || '讲授核心知识点，注重板书与互动结合。',
        layoutType: idx === 1 ? 'cover' : 'content',
      });
      idx++;
    }
  }

  return slides;
}

export function parseQuizMarkdown(markdown: string): {
  title: string;
  questions: QuizQuestion[];
  rawText: string;
} {
  const lines = markdown.split('\n');
  const titleLine = lines.find(l => l.startsWith('# '))?.replace(/^#\s*/, '') || '智能命题练习卷';
  
  // Extract individual numbered questions if possible
  const questions: QuizQuestion[] = [];
  const qRegex = /(\d+)[\.、\s]+([^\n]+)([\s\S]*?)(?=(?:\n\d+[\.、\s]+)|$)/g;
  let match;
  let qId = 1;

  while ((match = qRegex.exec(markdown)) !== null) {
    const qNum = parseInt(match[1], 10);
    const qTitle = match[2].trim();
    const qBody = match[3] || '';
    const fullBlock = qTitle + '\n' + qBody;

    // Detect options
    const options: string[] = [];
    const optRegex = /([A-D])[\.、\s\)]\s*([^\n]+)/g;
    let optMatch;
    while ((optMatch = optRegex.exec(fullBlock)) !== null) {
      options.push(`${optMatch[1]}. ${optMatch[2].trim()}`);
    }

    // Extract answer
    const ansMatch = fullBlock.match(/【?答案】?[：:\s]*([^\n]+)/i);
    const answer = ansMatch ? ansMatch[1].trim() : '';

    // Extract explanation
    const expMatch = fullBlock.match(/【?解析】?[：:\s]*([\s\S]*?)(?=(?:【?考点】?|【?易错】?|\n\d+[\.、]|$))/i);
    const explanation = expMatch ? expMatch[1].trim() : '详见考点步骤分析。';

    let type: QuizQuestion['type'] = 'qa';
    if (options.length >= 2) type = 'single';
    else if (fullBlock.includes('填空') || fullBlock.includes('_____')) type = 'fill';
    else if (fullBlock.includes('判断') || fullBlock.includes('正确') || fullBlock.includes('错误')) type = 'judge';

    questions.push({
      id: qId++,
      type,
      question: qTitle,
      options: options.length > 0 ? options : undefined,
      answer,
      explanation,
    });
  }

  return {
    title: titleLine,
    questions,
    rawText: markdown,
  };
}
