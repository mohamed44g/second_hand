"use client"

import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
} from "@mui/icons-material"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // مسح الخطأ عند الكتابة
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // التحقق من الاسم
    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب"
    }

    // التحقق من البريد الإلكتروني
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح"
    }

    // التحقق من رقم الهاتف (اختياري ولكن إذا تم إدخاله يجب أن يكون صحيحًا)
    if (formData.phone && !/^[0-9]{11}$/.test(formData.phone)) {
      newErrors.phone = "يرجى إدخال رقم هاتف صحيح مكون من 11 رقم"
    }

    // التحقق من الموضوع
    if (!formData.subject.trim()) {
      newErrors.subject = "الموضوع مطلوب"
    }

    // التحقق من الرسالة
    if (!formData.message.trim()) {
      newErrors.message = "الرسالة مطلوبة"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "الرسالة قصيرة جدًا، يجب أن تكون على الأقل 10 أحرف"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // محاكاة إرسال البيانات إلى الخادم
      setTimeout(() => {
        setIsSubmitting(false)
        setSnackbar({
          open: true,
          message: "تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.",
          severity: "success",
        })

        // إعادة تعيين النموذج
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      }, 1500)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // معلومات الاتصال
  const contactInfo = [
    {
      icon: <LocationIcon fontSize="large" color="primary" />,
      title: "العنوان",
      details: ["123 شارع التحرير", "وسط البلد، القاهرة", "مصر"],
    },
    {
      icon: <EmailIcon fontSize="large" color="primary" />,
      title: "البريد الإلكتروني",
      details: ["info@secondhand.com", "support@secondhand.com"],
    },
    {
      icon: <PhoneIcon fontSize="large" color="primary" />,
      title: "الهاتف",
      details: ["+20 123 456 7890", "+20 098 765 4321"],
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          اتصل بنا
        </Typography>
        <Typography variant="h6" color="text.secondary">
          نحن هنا للإجابة على جميع استفساراتك ومساعدتك في أي وقت
        </Typography>
        <Divider sx={{ mt: 4 }} />
      </Box>

      <Grid container spacing={4}>
        {/* معلومات الاتصال */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
              معلومات الاتصال
            </Typography>
            <Typography variant="body1" paragraph>
              يمكنك التواصل معنا من خلال أي من الوسائل التالية أو إرسال رسالة مباشرة باستخدام النموذج.
            </Typography>
          </Box>

          {contactInfo.map((info, index) => (
            <Card key={index} sx={{ mb: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {info.icon}
                  <Typography variant="h6" component="h3" sx={{ ml: 2 }}>
                    {info.title}
                  </Typography>
                </Box>
                {info.details.map((detail, i) => (
                  <Typography key={i} variant="body1" sx={{ mb: 0.5 }}>
                    {detail}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          ))}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              ساعات العمل
            </Typography>
            <Typography variant="body1">السبت - الخميس: 9:00 صباحًا - 6:00 مساءً</Typography>
            <Typography variant="body1">الجمعة: مغلق</Typography>
          </Box>
        </Grid>

        {/* نموذج الاتصال */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
              أرسل لنا رسالة
            </Typography>
            <Typography variant="body1" paragraph>
              يرجى ملء النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="الاسم"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="رقم الهاتف"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="الموضوع"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="الرسالة"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    disabled={isSubmitting}
                    sx={{ minWidth: 150 }}
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* خريطة الموقع */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          موقعنا
        </Typography>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Box
            component="iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.6661062603816!2d31.23561491511566!3d30.044419981884906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c2c3a8e77d%3A0x4c1c4e1d9b5e0d39!2sCairo%2C%20Egypt!5e0!3m2!1sen!2sus!4v1617289283694!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="خريطة الموقع"
          />
        </Paper>
      </Box>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ContactPage
