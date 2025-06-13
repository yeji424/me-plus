import { getPlansWithCache } from '../cache/planCache.js';
import { streamChat } from '../services/gptService.js';
import { buildPromptMessages } from '../utils/promptBuilder.js';
import { ChatSession } from '../models/ChatSession.js';
export const handlePlanRecommend = async (socket, { sessionId, message }) => {
  let session = await ChatSession.findOne({ sessionId });

  if (!session) {
    session = await ChatSession.create({ sessionId, messages: [] });
  }

  const plans = await getPlansWithCache();

  const newUserMsg = { role: 'user', content: message };
  const fullMessages = [...session.messages, newUserMsg];
  console.log(plans);
  const messages = buildPromptMessages(plans, fullMessages);
  let assistantReply = '';

  await streamChat(messages, socket, (chunk) => {
    assistantReply += chunk;
  });
  console.log('text');
  session.messages.push(newUserMsg);
  session.messages.push({ role: 'assistant', content: assistantReply });
  session.markModified('messages');
  await session.save();
};
