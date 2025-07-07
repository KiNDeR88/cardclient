import React, { useState, useRef, useEffect } from "react";
import {
  Box, Paper, Grid, Stack, Typography, Avatar, Chip, Button, Divider,
  Table, TableBody, TableRow, TableCell, TableHead,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, Checkbox, FormControl, InputLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import TelegramIcon from "@mui/icons-material/Telegram";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EventIcon from "@mui/icons-material/Event";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MapIcon from "@mui/icons-material/Map";
import { deepPurple } from "@mui/material/colors";
import { motion, AnimatePresence } from "framer-motion";

// Сообщения-шаблоны
const MESSAGE_TEMPLATES = [
  "Спасибо за ваш заказ! Если будут вопросы — пишите в ответ.",
  "Напоминаем: у вас осталось неиспользовано X бонусов.",
  "Ваша бронирование подтверждено. Ждем вас на курорте!",
  "До конца акции осталось 2 дня — не упустите скидку!",
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other} style={{ width: "100%" }}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CustomerProfileCard() {
  // Данные профиля (основная информация)
  const [profile, setProfile] = useState({
    name: "Мария Летунова",
    id: "874392",
    phone: "+7 988 509-96-62",
    email: "maria.letunova@yandex.ru",
    status: "Постоянный клиент",
    tags: ["VIP", "День рождения сегодня", "RFM: Gold", "Есть риск ухода"],
    ltv: "188 200 ₽",
    bonus: "2 413",
    age: 36,
    city: "Краснодар",
    regSource: "Сайт",
    regDate: "2017-11-03",
    preferChannel: "Telegram",
    rfm: "Gold",
    consentAds: true,
    consentPersonal: true,
    consentPush: false,
    riskFlag: true,
    segments: ["VIP", "По интересам: SPA", "Geo: Красная поляна", "RFM: Gold"],
    interests: [
      "Горные туры", "Зимний отдых", "SPA и релакс", "Детские активности", "Экстрим"
    ],
    favProducts: ["Ски-пасс взрослый", "SPA-процедуры"],
    geoTags: ["Красная Поляна", "Сочи"],
    country: "Россия",
    gender: "Женский",
    clientType: "Физ. лицо",
    address: "ул. Ленина, д. 10, кв. 24"
  });

  // Много тестовых данных для прокрутки
  const purchases = [
    {
      date: "12.06.2025",
      pos: "Офис Красная Поляна",
      employee: "Екатерина Миронова",
      receiptId: "CHK-12222",
      amount: "19 990 ₽",
      status: "Оплачено",
      receipt: [
        { name: "Ски-пасс взрослый", qty: 2, price: 8000, writtenOff: true, writtenOffBonuses: 5000, accrual: 350 },
        { name: "Фирменная термокружка", qty: 1, price: 1990, writtenOff: false, accrual: 99 },
        { name: "Сервисный сбор", qty: 1, price: 2000, writtenOff: false, accrual: 0 }
      ]
    },
    {
      date: "25.05.2025",
      pos: "GIFT-бутик",
      employee: "Антон Власов",
      receiptId: "CHK-11901",
      amount: "4 400 ₽",
      status: "Оплачено (списание бонусов)",
      receipt: [
        { name: "Подарочная карта", qty: 1, price: 4000, writtenOff: true, writtenOffBonuses: 4000, accrual: 0 },
        { name: "Открытка", qty: 2, price: 200, writtenOff: false, accrual: 20 }
      ]
    },
    ...Array(14).fill(0).map((_, i) => ({
      date: `0${i + 1}.05.2025`,
      pos: "Интернет-магазин",
      employee: "Онлайн",
      receiptId: `CHK-00${i + 200}`,
      amount: `${(3000 + i * 100).toLocaleString()} ₽`,
      status: i % 2 === 0 ? "Оплачено" : "Оплачено (списание бонусов)",
      receipt: [
        { name: "Футболка", qty: 1, price: 2000, writtenOff: false, accrual: 60 },
        { name: "Бутылка воды", qty: 2, price: 150, writtenOff: false, accrual: 5 }
      ]
    })),
  ];

  const promoCodes = [
    { code: "VIP2025", discount: "15%", used: false, activated: "01.06.2025" },
    { code: "SKI2024", discount: "20%", used: true, activated: "01.04.2025" },
    { code: "BIRTHDAY", discount: "30%", used: false, activated: "-" }
  ];
  const gifts = [
    { date: "2024-06-10", name: "Подарочная карта 3 000 ₽", status: "Активна" },
    { date: "2023-12-15", name: "Фирменный термос", status: "Получено" },
    { date: "2023-08-09", name: "Футболка", status: "Получено" }
  ];
  const bonusHistory = [
    { date: "12.06.2025", value: "+350", type: "Начисление", campaign: "Покупка ски-пасс" },
    { date: "25.05.2025", value: "-4000", type: "Списание", campaign: "Подарочная карта" },
    ...Array(14).fill(0).map((_, i) => ({
      date: `0${i + 1}.05.2025`,
      value: i % 2 === 0 ? "+200" : "-500",
      type: i % 2 === 0 ? "Начисление" : "Списание",
      campaign: "Лояльность"
    })),
  ];
  const messageHistory = [
    { date: "12.06.2025 17:01", channel: "SMS", direction: "Исходящее", type: "Ручная рассылка", campaign: "Летний сезон", text: "Спасибо за ваш отзыв!" },
    { date: "11.06.2025 12:23", channel: "Telegram", direction: "Исходящее", type: "Ручная рассылка", campaign: "Акция скидка", text: "Ваша скидка активирована" },
    ...Array(10).fill(0).map((_, i) => ({
      date: `0${i + 3}.06.2025 11:00`, channel: "SMS", direction: "Исходящее", type: "Кампания", campaign: "Промоакция", text: `Тестовое сообщение №${i + 1}`
    })),
  ];
  const npsSurveys = [
    { date: "12.06.2025", channel: "Email", score: 9, comment: "Все отлично!", order: "CHK-12222" },
    { date: "24.05.2025", channel: "SMS", score: 5, comment: "Была задержка с отправкой заказа", order: "CHK-11901" }
  ];
  const activities = [
    { date: "13.06.2025", type: "Открытие письма", icon: <EmailIcon color="primary" />, desc: "Открыл рассылку: Летний сезон" },
    { date: "13.06.2025", type: "Клик по кнопке", icon: <SmsIcon color="success" />, desc: "Купил ски-пасс по акции" },
    ...Array(12).fill(0).map((_, i) => ({
      date: `0${i + 1}.06.2025`,
      type: "Посещение сайта",
      icon: <PersonIcon color="info" />,
      desc: `Переход №${i + 1}`
    })),
  ];

  // Табы, модалки, sticky
  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [receiptModal, setReceiptModal] = useState({ open: false, purchase: null });
  const [msgModal, setMsgModal] = useState(false);
  const [msgChannel, setMsgChannel] = useState("SMS");
  const [msgText, setMsgText] = useState("");
  const [msgSending, setMsgSending] = useState(false);

  // Sticky-brow logic
  const headerRef = useRef(null);
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      setShowSticky(rect.bottom <= 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Открытие/закрытие модалок и отправка сообщений
  const openReceipt = (purchase) => setReceiptModal({ open: true, purchase });
  const closeReceipt = () => setReceiptModal({ open: false, purchase: null });
  const handleEdit = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const openMsgModal = () => { setMsgText(""); setMsgChannel("SMS"); setMsgModal(true); };
  const closeMsgModal = () => setMsgModal(false);
  const sendMessage = () => {
    if (!msgText.trim()) return;
    setMsgSending(true);
    setTimeout(() => {
      setMsgSending(false);
      setMsgModal(false);
    }, 700);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fa", pb: 8, px: { xs: 1, md: 4 } }}>
      {/* Sticky Бровь */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.24, type: "spring" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1301,
              background: "rgba(255,255,255,0.98)",
              boxShadow: "0 4px 24px #bbdefb33",
              borderBottom: "1.5px solid #dde7f7",
              padding: "10px 0"
            }}
          >
            <Box sx={{ maxWidth: 1300, mx: "auto", px: 2, display: "flex", alignItems: "center", minHeight: 54 }}>
              <Avatar sx={{ width: 44, height: 44, fontSize: 22, bgcolor: deepPurple[400], color: "#fff", mr: 2 }}>
                {profile.name.split(" ").map(part => part[0]).join("").toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={700} noWrap>{profile.name}</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography fontSize={15} color="text.secondary" sx={{ mr: 2 }}>{profile.phone}</Typography>
                  <Chip size="small" icon={<ContentCopyIcon fontSize="small" />} label={`ID: ${profile.id}`} sx={{ fontWeight: 700 }} />
                  <Chip size="small" label={profile.status} color={profile.status === "Постоянный клиент" ? "success" : "warning"} sx={{ fontWeight: 700 }} />
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleEdit}
                  startIcon={<EditIcon />}
                  sx={{ borderRadius: 2, minWidth: 40, fontWeight: 700 }}
                >
                  Редактировать
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={openMsgModal}
                  startIcon={<SendIcon />}
                  sx={{ borderRadius: 2, minWidth: 40, fontWeight: 700 }}
                >
                  Уведомление
                </Button>
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Основной HEADER */}
      <Box ref={headerRef}>
        <Paper
          sx={{
            maxWidth: 1300,
            mx: "auto",
            mt: 4,
            mb: 2,
            borderRadius: 5,
            boxShadow: "0 8px 40px 0 #c4dafc2b",
            overflow: "hidden",
            position: "relative",
            background: "linear-gradient(120deg, #e6ebfc 60%, #f5f8fd 100%)"
          }}
        >
          <Grid container>
            {/* Левая часть */}
            <Grid item xs={12} md={3} sx={{ bgcolor: "#f4f7ff", py: 5, px: 3, minHeight: 320 }}>
              <Stack alignItems="center" spacing={2}>
                <Avatar sx={{
                  width: 92, height: 92, fontSize: 42, bgcolor: deepPurple[400], color: "#fff"
                }}>
                  {profile.name.split(" ").map(part => part[0]).join("").toUpperCase()}
                </Avatar>
                <Typography variant="h5" fontWeight={800} color="#22334d" sx={{ textAlign: "center", mb: 1 }}>
                  {profile.name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" mb={1}>
                  {profile.tags.map((t, i) => (
                    <Chip
                      key={i}
                      label={t}
                      icon={
                        t === "VIP" ? <StarIcon sx={{ color: "#FFD700" }} /> :
                        t === "День рождения сегодня" ? <EventIcon sx={{ color: "#ff5151" }} /> :
                        t === "Есть риск ухода" ? <WarningAmberIcon sx={{ color: "#e05f45" }} /> : null
                      }
                      sx={{
                        bgcolor:
                          t === "VIP" ? "#fffde6" :
                          t === "День рождения сегодня" ? "#fff3f3" :
                          t === "Есть риск ухода" ? "#fff1f1" :
                          "#e4eaff",
                        color:
                          t === "VIP" ? "#D5B100" :
                          t === "День рождения сегодня" ? "#ff5151" :
                          t === "Есть риск ухода" ? "#e05f45" :
                          "#4c56a6",
                        fontWeight: 700,
                        border: "1px solid #dde3f7"
                      }}
                    />
                  ))}
                </Stack>
                <Stack alignItems="center" spacing={0.5}>
                  <Chip icon={<EmailIcon />} label={profile.email} size="small" sx={{ bgcolor: "#eef0f7" }} />
                  <Chip label={profile.phone} size="small" sx={{ bgcolor: "#eef0f7" }} />
                </Stack>
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ mt: 3, borderRadius: 3, fontWeight: 700 }}
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >Редактировать профиль</Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="small"
                  sx={{ borderRadius: 3, mt: 1, fontWeight: 700 }}
                  startIcon={<SendIcon />}
                  onClick={openMsgModal}
                >Отправить сообщение</Button>
              </Stack>
            </Grid>
            {/* Правая часть */}
            <Grid item xs={12} md={9} sx={{ py: 5, px: { xs: 2, md: 5 } }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>Общий LTV</Typography>
                  <Typography variant="h6" fontWeight={800}>{profile.ltv}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>Бонусы</Typography>
                  <Typography variant="h6" fontWeight={800}>{profile.bonus}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>Возраст</Typography>
                  <Typography variant="h6" fontWeight={800}>{profile.age} лет</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>Город</Typography>
                  <Typography variant="h6" fontWeight={800}>{profile.city}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>ID клиента</Typography>
                  <Chip size="small" icon={<ContentCopyIcon fontSize="small" />} label={profile.id} sx={{ fontWeight: 700, mt: 0.6 }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>Предпочтительный канал</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {profile.preferChannel === "Email" && <EmailIcon fontSize="small" color="primary" />}
                    {profile.preferChannel === "SMS" && <SmsIcon fontSize="small" color="success" />}
                    {profile.preferChannel === "Telegram" && <TelegramIcon fontSize="small" sx={{ color: "#229ed9" }} />}
                    <Typography variant="h6" fontWeight={600}>{profile.preferChannel}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>RFM</Typography>
                  <Chip label={profile.rfm} color={profile.rfm === "Gold" ? "warning" : "default"} sx={{ fontWeight: 700, mt: 0.6 }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>Источник регистрации</Typography>
                  <Typography variant="h6" fontWeight={800}>{profile.regSource}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography color="text.secondary" fontSize={15}>Дата регистрации</Typography>
                  <Typography variant="h6" fontWeight={800}>{profile.regDate}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mb={1}>
                <Typography fontSize={15} color="text.secondary">Cегменты и интересы:</Typography>
                {profile.segments.map((seg, i) => (
                  <Chip
                    key={i}
                    size="small"
                    label={seg}
                    icon={seg.startsWith("Geo") ? <MapIcon fontSize="small" sx={{ color: "#27A9E0" }} /> : undefined}
                    sx={{ bgcolor: seg.startsWith("Geo") ? "#e9f8fc" : "#f4f5fa", fontWeight: 700, mr: .5 }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                {profile.interests.map((interest, i) => (
                  <Chip key={i} label={interest} sx={{ bgcolor: "#f3f6fc", m: .3 }} />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontSize={15} color="text.secondary">Любимые продукты:</Typography>
                {profile.favProducts.map((prod, i) => (
                  <Chip key={i} size="small" label={prod} sx={{ bgcolor: "#ffe9f1", fontWeight: 600, mr: .5 }} />
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Typography fontSize={15} color="text.secondary" mb={.5}>Согласия:</Typography>
                <Chip size="small" label="Рекламные рассылки" color={profile.consentAds ? "success" : "default"} />
                <Chip size="small" label="Обработка ПДн" color={profile.consentPersonal ? "success" : "default"} />
                <Chip size="small" label="Push-уведомления" color={profile.consentPush ? "success" : "default"} />
              </Stack>
              <Typography fontSize={15} color="text.secondary" sx={{ mt: 1 }}>
                Адрес: <b>{profile.address}</b>
              </Typography>
              <Typography fontSize={15} color="text.secondary">
                Пол: <b>{profile.gender}</b> &nbsp;|&nbsp; Тип: <b>{profile.clientType}</b>
              </Typography>
              <Typography fontSize={15} color="text.secondary">
                Страна: <b>{profile.country}</b> &nbsp;|&nbsp; Гео-теги: {profile.geoTags.join(", ")}
              </Typography>
              <Typography fontSize={15} color="text.secondary" sx={{ mt: 2 }}>
                Статус: <b>{profile.status}</b>
              </Typography>
              {profile.riskFlag && (
                <Chip
                  icon={<WarningAmberIcon sx={{ color: "#e05f45" }} />}
                  label="Есть риск ухода"
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 800, mt: 1 }}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* --- MAIN CONTENT --- */}
      <Paper
        sx={{
          maxWidth: 1300,
          mx: "auto",
          borderRadius: 5,
          px: { xs: 1, md: 4 },
          py: { xs: 1, md: 3 },
          mt: 2
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ mb: 2, fontWeight: 800 }}
        >
          <Tab label="Покупки" />
          <Tab label="Бонусы" />
          <Tab label="Промокоды" />
          <Tab label="Подарки" />
          <Tab label="История сообщений" />
          <Tab label="NPS" />
          <Tab label="Активности" />
        </Tabs>

        {/* Покупки */}
        <TabPanel value={tab} index={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Точка продаж</TableCell>
                <TableCell>Сотрудник</TableCell>
                <TableCell>Чек</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.pos}</TableCell>
                  <TableCell>{p.employee}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openReceipt(p)}
                      endIcon={<ReceiptLongIcon />}
                    >
                      {p.receiptId}
                    </Button>
                  </TableCell>
                  <TableCell>{p.amount}</TableCell>
                  <TableCell>
                    <Chip label={p.status} color={p.status.includes("списание") ? "warning" : "success"} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>

        {/* Бонусы */}
        <TabPanel value={tab} index={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Тип операции</TableCell>
                <TableCell>Кампания</TableCell>
                <TableCell>Сумма</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bonusHistory.map((b, i) => (
                <TableRow key={i}>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>
                    {b.type === "Начисление" ? (
                      <Chip label="Начисление" color="success" size="small" />
                    ) : (
                      <Chip label="Списание" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{b.campaign}</TableCell>
                  <TableCell>
                    <Typography sx={{
                      fontWeight: 700,
                      color: b.type === "Начисление" ? "#2e7d32" : "#b71c1c"
                    }}>{b.value}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>

        {/* Промокоды */}
        <TabPanel value={tab} index={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Промокод</TableCell>
                <TableCell>Скидка</TableCell>
                <TableCell>Активирован</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promoCodes.map((pr, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Chip icon={<LocalOfferIcon />} label={pr.code} color="info" />
                  </TableCell>
                  <TableCell>{pr.discount}</TableCell>
                  <TableCell>{pr.activated}</TableCell>
                  <TableCell>
                    <Chip label={pr.used ? "Использован" : "Активен"} color={pr.used ? "success" : "warning"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>

        {/* Подарки */}
        <TabPanel value={tab} index={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Подарок</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gifts.map((g, i) => (
                <TableRow key={i}>
                  <TableCell>{g.date}</TableCell>
                  <TableCell>
                    <Chip icon={<CardGiftcardIcon />} label={g.name} />
                  </TableCell>
                  <TableCell>
                    <Chip label={g.status} color={g.status === "Активна" ? "success" : "default"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>

        {/* История сообщений */}
        <TabPanel value={tab} index={4}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Канал</TableCell>
                <TableCell>Способ</TableCell>
                <TableCell>Тип отправки</TableCell>
                <TableCell>Кампания</TableCell>
                <TableCell>Текст</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messageHistory.map((m, i) => (
                <TableRow key={i}>
                  <TableCell>{m.date}</TableCell>
                  <TableCell>
                    {m.channel === "SMS" ? <Chip icon={<SmsIcon fontSize="small" />} label="SMS" size="small" /> :
                      <Chip icon={<TelegramIcon fontSize="small" />} label="Telegram" size="small" color="primary" />}
                  </TableCell>
                  <TableCell>{m.direction}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>{m.campaign}</TableCell>
                  <TableCell>{m.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>

        {/* NPS */}
        <TabPanel value={tab} index={5}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Канал</TableCell>
                <TableCell>Оценка (0-10)</TableCell>
                <TableCell>Комментарий</TableCell>
                <TableCell>Заказ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {npsSurveys.map((n, i) => (
                <TableRow key={i}>
                  <TableCell>{n.date}</TableCell>
                  <TableCell>
                    <Chip label={n.channel} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <StarIcon fontSize="small" sx={{ color: n.score > 8 ? "#219653" : n.score > 6 ? "#FFB300" : "#C62828" }} />
                      <Typography fontWeight={700}>{n.score}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{n.comment}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => openReceipt(purchases.find(x => x.receiptId === n.order))}
                      endIcon={<ReceiptLongIcon />}
                    >{n.order}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>

        {/* Активности */}
        <TabPanel value={tab} index={6}>
          <Stack spacing={2}>
            {activities.map((a, i) => (
              <Paper key={i} sx={{ p: 2, display: "flex", alignItems: "center", borderRadius: 3 }}>
                <Box sx={{ mr: 2 }}>{a.icon}</Box>
                <Box>
                  <Typography fontWeight={700}>{a.type}</Typography>
                  <Typography color="text.secondary" fontSize={15}>{a.desc}</Typography>
                </Box>
                <Box sx={{ ml: "auto" }}><Typography color="text.secondary" fontSize={15}>{a.date}</Typography></Box>
              </Paper>
            ))}
          </Stack>
        </TabPanel>
      </Paper>

      {/* ----------- Модальное окно ЧЕК ----------- */}
      <Dialog
        open={receiptModal.open}
        onClose={closeReceipt}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 21, letterSpacing: .5, pb: 0 }}>
          Чек {receiptModal.purchase?.receiptId} — {receiptModal.purchase?.date}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.5, fontSize: 16 }}>
            <b>Точка продаж:</b> {receiptModal.purchase?.pos}<br />
            <b>Сотрудник:</b> {receiptModal.purchase?.employee}
          </Typography>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Товар</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Кол-во</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Цена</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Сумма</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Списано бонусов</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Начислено бонусов</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receiptModal.purchase?.receipt.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <span>{row.name}</span>
                      {row.writtenOff && (
                        <Chip
                          label="Списано бонусами"
                          size="small"
                          sx={{
                            bgcolor: "#1976d2",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            height: "28px",
                            borderRadius: 2,
                            px: 1.5
                          }}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>{row.qty}</TableCell>
                  <TableCell>{row.price.toLocaleString()} ₽</TableCell>
                  <TableCell>{(row.qty * row.price).toLocaleString()} ₽</TableCell>
                  <TableCell align="center">
                    {row.writtenOffBonuses
                      ? <span style={{
                        color: "#9c27b0",
                        fontWeight: 700,
                        fontSize: 16
                      }}>{row.writtenOffBonuses} бонусов</span>
                      : <span style={{ color: "#bbb" }}>—</span>
                    }
                  </TableCell>
                  <TableCell align="center">
                    {row.accrual
                      ? <span style={{
                        color: "#2e7d32",
                        fontWeight: 700,
                        fontSize: 16
                      }}>{row.accrual} бонусов</span>
                      : <span style={{ color: "#bbb" }}>—</span>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReceipt} variant="outlined">ЗАКРЫТЬ</Button>
        </DialogActions>
      </Dialog>

      {/* --------- Модальное окно ОТПРАВКИ СООБЩЕНИЯ --------- */}
      <Dialog
        open={msgModal}
        onClose={closeMsgModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4, bgcolor: "#fff",
            boxShadow: "0 8px 32px rgba(24,32,52,0.18)"
          }
        }}
      >
        <DialogTitle>
          Отправить сообщение клиенту
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ mb: 2, minWidth: 140 }}>
            <InputLabel id="channel-label">Канал</InputLabel>
            <Select
              labelId="channel-label"
              value={msgChannel}
              label="Канал"
              onChange={e => setMsgChannel(e.target.value)}
              startAdornment={
                msgChannel === "SMS"
                  ? <SmsIcon sx={{ mr: 1, color: "#3f51b5" }} />
                  : <TelegramIcon sx={{ mr: 1, color: "#0088cc" }} />
              }
            >
              <MenuItem value="SMS">
                <Stack direction="row" alignItems="center" spacing={1}><SmsIcon />SMS</Stack>
              </MenuItem>
              <MenuItem value="Telegram">
                <Stack direction="row" alignItems="center" spacing={1}><TelegramIcon />Telegram</Stack>
              </MenuItem>
            </Select>
          </FormControl>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
              {MESSAGE_TEMPLATES.map((tpl, idx) => (
                <Button
                  key={idx}
                  variant="outlined"
                  size="small"
                  onClick={() => setMsgText(tpl)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#F7F9FC",
                    fontSize: 13,
                    px: 1.5,
                    textTransform: "none",
                  }}
                  startIcon={<ContentCopyIcon fontSize="small" />}
                >{tpl.length > 30 ? tpl.slice(0, 27) + "…" : tpl}</Button>
              ))}
            </Stack>
            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              placeholder="Введите сообщение…"
              value={msgText}
              onChange={e => setMsgText(e.target.value)}
              sx={{
                ".MuiInputBase-root": { bgcolor: "#F6F9FC", borderRadius: 2 }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeMsgModal}>Отмена</Button>
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={!msgText.trim() || msgSending}
            endIcon={<SendIcon />}
            sx={{ textTransform: "none" }}
          >
            {msgSending ? "Отправка..." : "Отправить"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Модальное окно редактирования профиля --- */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Редактирование профиля</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="ФИО"
              fullWidth
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            />
            <TextField
              label="Email"
              fullWidth
              value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
            />
            <TextField
              label="Телефон"
              fullWidth
              value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
            />
            <TextField
              label="Город"
              fullWidth
              value={profile.city}
              onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
            />
            {/* Можно добавить больше полей, если нужно */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Отмена</Button>
          <Button variant="contained" onClick={handleEditClose}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}