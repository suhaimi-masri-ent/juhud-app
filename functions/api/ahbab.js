export async function onRequest(context) {
  const { request, env } = context;

  // Sediakan sambungan ke database D1 (kita fullnamekan binding ini sebagai DB nanti)
  const db = env.DB; 

  // JIKA USER MINTA DATA (GET)
  if (request.method === "GET") {
    const { results } = await db.prepare("SELECT * FROM ahbab").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // JIKA USER HANTAR DATA BARU (POST)
  if (request.method === "POST") {
    const body = await request.json();
    await db.prepare("INSERT INTO ahbab (fullname) VALUES (?)")
              .bind(body.fullname)
              .run();

    return new Response(JSON.stringify({ status: "Berjaya ditambah!" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
