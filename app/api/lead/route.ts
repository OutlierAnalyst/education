import { NextRequest, NextResponse } from "next/server";

// Эндпоинт принимает заявку с формы на сайте и пересылает её
// личным сообщением ВКонтакте на аккаунт владельца сайта.
// Все секреты (токен, id получателя) берутся ТОЛЬКО из переменных окружения
// и никогда не попадают в код или в ответ клиенту.

export const runtime = "nodejs";

interface LeadPayload {
  name?: string;
  contact?: string;
  comment?: string;
}

interface LeadResponse {
  ok: boolean;
  error?: string;
}

function jsonError(message: string, status: number) {
  return NextResponse.json<LeadResponse>({ ok: false, error: message }, { status });
}

function validate(payload: LeadPayload): string | null {
  const name = payload.name?.trim() ?? "";
  const contact = payload.contact?.trim() ?? "";

  if (name.length < 2) {
    return "Укажи имя (минимум 2 символа)";
  }
  if (name.length > 100) {
    return "Имя слишком длинное";
  }
  if (!contact) {
    return "Укажи телефон или ссылку на соцсеть для связи";
  }
  if (contact.length > 200) {
    return "Контакт слишком длинный";
  }
  if (payload.comment && payload.comment.length > 2000) {
    return "Комментарий слишком длинный";
  }
  return null;
}

function buildMessageText(payload: LeadPayload): string {
  const name = payload.name!.trim();
  const contact = payload.contact!.trim();
  const comment = payload.comment?.trim();

  const lines = [
    "📩 Новая заявка с сайта",
    `Имя: ${name}`,
    `Контакт: ${contact}`,
  ];

  if (comment) {
    lines.push(`Комментарий: ${comment}`);
  }

  return lines.join("\n");
}

export async function POST(req: NextRequest) {
  let payload: LeadPayload;

  try {
    payload = await req.json();
  } catch {
    return jsonError("Некорректный формат запроса", 400);
  }

  // Валидация на сервере (не доверяем клиенту)
  const validationError = validate(payload);
  if (validationError) {
    return jsonError(validationError, 400);
  }

  // Секреты берём только из переменных окружения.
  const VK_ACCESS_TOKEN = process.env.VK_ACCESS_TOKEN;
  const VK_PEER_ID = process.env.VK_PEER_ID;
  const VK_API_VERSION = process.env.VK_API_VERSION || "5.199";

  if (!VK_ACCESS_TOKEN || !VK_PEER_ID) {
    // Не роняем сервер, просто логируем факт отсутствия конфигурации
    // (без самих значений — их может и не быть).
    console.error(
      "[api/lead] Не заданы переменные окружения VK_ACCESS_TOKEN и/или VK_PEER_ID"
    );
    return jsonError("Форма временно недоступна, попробуйте позже", 503);
  }

  const message = buildMessageText(payload);
  // Лог текста заявки допустим — секретов в нём нет.
  console.log("[api/lead] Новая заявка:", message.replace(/\n/g, " | "));

  const randomId = Date.now() * 1000 + Math.floor(Math.random() * 1000);

  const params = new URLSearchParams({
    access_token: VK_ACCESS_TOKEN,
    peer_id: VK_PEER_ID,
    message,
    v: VK_API_VERSION,
    random_id: String(randomId),
  });

  let vkResponse: Response;
  try {
    vkResponse = await fetch("https://api.vk.com/method/messages.send", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  } catch (err) {
    console.error("[api/lead] Сетевая ошибка при обращении к VK API:", err);
    return jsonError("Не удалось отправить заявку, попробуйте позже", 502);
  }

  if (!vkResponse.ok) {
    console.error("[api/lead] VK API вернул HTTP статус:", vkResponse.status);
    return jsonError("Не удалось отправить заявку, попробуйте позже", 502);
  }

  let data: unknown;
  try {
    data = await vkResponse.json();
  } catch (err) {
    console.error("[api/lead] Не удалось разобрать ответ VK API:", err);
    return jsonError("Не удалось отправить заявку, попробуйте позже", 502);
  }

  // ВК всегда отвечает HTTP 200, даже при ошибке — реальная ошибка в поле error.
  if (data && typeof data === "object" && "error" in data) {
    const vkError = (data as { error?: { error_msg?: string; error_code?: number } }).error;
    console.error(
      "[api/lead] VK API вернул ошибку:",
      vkError?.error_code,
      vkError?.error_msg
    );
    return jsonError("Не удалось отправить заявку, попробуйте позже", 502);
  }

  return NextResponse.json<LeadResponse>({ ok: true }, { status: 200 });
}
