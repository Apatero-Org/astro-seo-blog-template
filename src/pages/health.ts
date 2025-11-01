export const GET = async () => {
  return new Response(JSON.stringify({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'astro-blog'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};