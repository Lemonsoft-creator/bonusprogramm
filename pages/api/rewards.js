export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const rewards = [
    {
      tier: 'Bronze',
      threshold: 50,
      description: '10% Rabatt auf das nächste Training',
    },
    {
      tier: 'Silber',
      threshold: 200,
      description: '20% Rabatt auf das nächste Training',
    },
    {
      tier: 'Gold',
      threshold: 500,
      description: 'Freies Training und Überraschungsprämie',
    },
  ];
  res.status(200).json(rewards);
}
