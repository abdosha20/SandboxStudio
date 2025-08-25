const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Currency & Language Toggle Logic for Pricing Table
document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('currencyToggle');
  const prices = document.querySelectorAll('.plan-price');

  // Arabic translations for plans/features/descriptions
  const arabicPlans = {
    starter: {
      title: 'المبتدئ',
      desc: 'مثالي للأفراد والشركات الناشئة الصغيرة لإطلاق موقعهم الأول.',
      features: [
        'موقع مخصص من 5 صفحات',
        'تصميم متجاوب مع الجوال',
        'إعداد SEO أساسي',
        'دمج نموذج التواصل'
      ]
    },
    business: {
      title: 'الأعمال',
      desc: 'للشركات المتنامية التي تحتاج إلى مزيد من الميزات والمرونة.',
      features: [
        'حتى 15 صفحة مخصصة',
        'نظام مدونة وأخبار',
        'أدوات SEO متقدمة',
        'دمج التحليلات',
        'دعم أولوية'
      ]
    },
    ecommerce: {
      title: 'التجارة الإلكترونية',
      desc: 'متجر إلكتروني متكامل مع مدفوعات آمنة وإدارة المنتجات.',
      features: [
        'عدد غير محدود من المنتجات',
        'دمج بوابة الدفع',
        'إدارة المخزون',
        'نظام تتبع الطلبات',
        'دعم مميز لمدة سنة'
      ]
    }
  };

  const englishPlans = {
    starter: {
      title: 'Starter',
      desc: 'Perfect for individuals and small startups launching their first site.',
      features: [
        'Custom 5-page website',
        'Mobile responsive design',
        'Basic SEO setup',
        'Contact form integration'
      ]
    },
    business: {
      title: 'Business',
      desc: 'For growing businesses that need more features and flexibility.',
      features: [
        'Up to 15 custom pages',
        'Blog & news system',
        'Advanced SEO tools',
        'Analytics integration',
        'Priority support'
      ]
    },
    ecommerce: {
      title: 'E-Commerce',
      desc: 'Full-featured online store with secure payments and product management.',
      features: [
        'Unlimited product listings',
        'Payment gateway integration',
        'Inventory management',
        'Order tracking system',
        '1 year premium support'
      ]
    }
  };

  function animatePriceChange(el, newText) {
    el.style.transition = 'opacity 0.18s';
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = newText;
      el.style.opacity = 1;
    }, 180);
  }

  function updatePlansTo(lang) {
    const plans = lang === 'ar' ? arabicPlans : englishPlans;
    document.querySelectorAll('.pricing-card').forEach(card => {
      const plan = card.getAttribute('data-plan');
      // Title
      const titleEl = card.querySelector('.plan-title');
      titleEl.textContent = plans[plan].title;
      // Description
      const descEl = card.querySelector('.plan-desc');
      descEl.textContent = plans[plan].desc;
      // Features
      const featuresEl = card.querySelector('.plan-features');
      featuresEl.innerHTML = '';
      plans[plan].features.forEach(f => {
        const li = document.createElement('li');
        const check = document.createElement('span');
        check.className = 'check';
        check.textContent = '✔';
        li.appendChild(check);
        li.appendChild(document.createTextNode(f));
        featuresEl.appendChild(li);
      });
      // RTL for Arabic, LTR for English
      card.dir = lang === 'ar' ? 'rtl' : 'ltr';
      card.style.textAlign = lang === 'ar' ? 'right' : 'left';
    });
  }

  if (toggle) {
    toggle.addEventListener('change', function() {
      prices.forEach(price => {
        const gbp = price.getAttribute('data-gbp');
        const lyd = price.getAttribute('data-lyd');
        animatePriceChange(price, this.checked ? lyd : gbp);
      });
      // Switch language and direction
      if (this.checked) {
        updatePlansTo('ar');
      } else {
        updatePlansTo('en');
      }
    });
    // Ensure initial state is English
    updatePlansTo('en');
  }
});

// Show/hide "Other" field and validate form
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('quoteForm');
  const otherCheckbox = document.getElementById('otherServiceCheckbox');
  const otherInput = document.getElementById('otherServiceInput');

  // Show/hide "Other" input field
  if (otherCheckbox) {
    otherCheckbox.addEventListener('change', function () {
      if (this.checked) {
        otherInput.style.display = 'block';
        otherInput.required = true;
      } else {
        otherInput.style.display = 'none';
        otherInput.value = '';
        otherInput.required = false;
      }
    });
  }

  // Client-side validation
  form.addEventListener('submit', function (e) {
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(span => span.textContent = '');

    // Full Name
    const fullName = form.fullName;
    if (!fullName.value.trim()) {
      showError(fullName, 'Full name is required.');
      valid = false;
    }

    // Email
    const email = form.email;
    if (!email.value.trim()) {
      showError(email, 'Email is required.');
      valid = false;
    } else if (!/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.value.trim())) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    // Services Required (at least one)
    const serviceCheckboxes = form.querySelectorAll('input[name="services"]:checked');
    if (serviceCheckboxes.length === 0) {
      showError(form.querySelector('input[name="services"]'), 'Please select at least one service.');
      valid = false;
    }
    // If "Other" is checked, ensure input is filled
    if (otherCheckbox.checked && !otherInput.value.trim()) {
      showError(otherInput, 'Please specify the other service.');
      valid = false;
    }

    // Project Details
    const details = form.details;
    if (!details.value.trim()) {
      showError(details, 'Please provide project details.');
      valid = false;
    }

    // File upload: optional, but check type if provided
    const fileInput = form.attachment;
    if (fileInput && fileInput.files.length > 0) {
      const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
      if (!allowed.includes(fileInput.files[0].type)) {
        showError(fileInput, 'Allowed file types: PDF, DOC, DOCX, PNG, JPG.');
        valid = false;
      }
    }

    if (!valid) {
      e.preventDefault();
    }
  });

  // Helper to show error message under input
  function showError(input, message) {
    let group = input.closest('.form-group');
    if (group) {
      let error = group.querySelector('.error-message');
      if (error) error.textContent = message;
    }
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  }

  // Reset form and remove error messages
  form.addEventListener('reset', function () {
    setTimeout(() => {
      form.querySelectorAll('.error-message').forEach(span => span.textContent = '');
      form.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
      });
    }, 10);
  });
});

// Quote form language toggle
document.addEventListener('DOMContentLoaded', function () {
  // Listen for the currency toggle
  const currencyToggle = document.getElementById('currencyToggle');
  const form = document.getElementById('quoteForm');
  if (!form || !currencyToggle) return;

  // English and Arabic translations for the quote form
  const formLang = {
    en: {
      title: "Need a Custom Quote?",
      desc: "If you need a quote for all of our services or just some of them, please fill out the form below and our team will get back to you as soon as possible.",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      services: "Services Required",
      servicesList: [
        "Website Design & Development",
        "Web Hosting",
        "SEO & Marketing",
        "E-Commerce Setup",
        "Website Maintenance",
        "Branding & Design",
        "Other"
      ],
      otherPlaceholder: "Please specify...",
      details: "Project Details / Message",
      budget: "Preferred Budget Range",
      budgetOptions: [
        "Select a range (optional)",
        "£0–£500",
        "£500–£1000",
        "£1000+"
      ],
      attach: "Attach a file (optional)",
      submit: "Request Quote",
      privacy: "We respect your privacy. Your information will only be used to provide you with a quote and will not be shared with third parties.",
      required: "*"
    },
    ar: {
      title: "هل تحتاج إلى عرض سعر مخصص؟",
      desc: "إذا كنت بحاجة إلى عرض سعر لجميع خدماتنا أو بعضها فقط، يرجى ملء النموذج أدناه وسيتواصل معك فريقنا في أقرب وقت ممكن.",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      services: "الخدمات المطلوبة",
      servicesList: [
        "تصميم وتطوير المواقع",
        "استضافة المواقع",
        "تحسين محركات البحث والتسويق",
        "إعداد التجارة الإلكترونية",
        "صيانة المواقع",
        "الهوية البصرية والتصميم",
        "أخرى"
      ],
      otherPlaceholder: "يرجى التحديد...",
      details: "تفاصيل المشروع / الرسالة",
      budget: "النطاق السعري المفضل",
      budgetOptions: [
        "اختر نطاقاً (اختياري)",
        "٠–٥٠٠ جنيه",
        "٥٠٠–١٠٠٠ جنيه",
        "١٠٠٠+ جنيه"
      ],
      attach: "إرفاق ملف (اختياري)",
      submit: "طلب عرض سعر",
      privacy: "نحن نحترم خصوصيتك. سيتم استخدام معلوماتك فقط لتزويدك بعرض سعر ولن تتم مشاركتها مع أي طرف ثالث.",
      required: "*"
    }
  };

  // Helper to update the form language
  function updateFormLang(lang) {
    const l = formLang[lang];
    // Section title and description
    document.querySelector('.quote-section h2').textContent = l.title;
    document.querySelector('.quote-desc').textContent = l.desc;

    // Labels
    form.querySelector('label[for="fullName"]').innerHTML = `${l.fullName} <span class="required">${l.required}</span>`;
    form.querySelector('label[for="email"]').innerHTML = `${l.email} <span class="required">${l.required}</span>`;
    form.querySelector('label[for="phone"]').textContent = l.phone;
    form.querySelector('.form-group label').nextElementSibling.textContent = l.services + " " + l.required;

    // Services checkboxes
    const serviceLabels = form.querySelectorAll('.checkbox-list label');
    l.servicesList.forEach((txt, i) => {
      if (serviceLabels[i]) {
        // For "Other", keep the input
        if (txt === "Other" || txt === "أخرى") {
          serviceLabels[i].lastChild.textContent = " " + txt;
        } else {
          serviceLabels[i].lastChild.nodeValue = " " + txt;
        }
      }
    });

    // "Other" input placeholder
    document.getElementById('otherServiceInput').placeholder = l.otherPlaceholder;

    // Project details
    form.querySelector('label[for="details"]').innerHTML = `${l.details} <span class="required">${l.required}</span>`;

    // Budget
    form.querySelector('label[for="budget"]').textContent = l.budget;
    const budgetSelect = form.querySelector('#budget');
    budgetSelect.innerHTML = '';
    l.budgetOptions.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      budgetSelect.appendChild(option);
    });

    // Attach
    form.querySelector('label[for="attachment"]').textContent = l.attach;

    // Submit button
    form.querySelector('.quote-submit-btn').textContent = l.submit;

    // Privacy disclaimer
    document.querySelector('.privacy-disclaimer').textContent = l.privacy;

    // Direction
    if (lang === 'ar') {
      document.querySelector('.quote-section').dir = "rtl";
      form.classList.add('rtl');
    } else {
      document.querySelector('.quote-section').dir = "ltr";
      form.classList.remove('rtl');
    }
  }

  // Listen to toggle
  currencyToggle.addEventListener('change', function () {
    if (this.checked) {
      updateFormLang('ar');
    } else {
      updateFormLang('en');
    }
  });

  // Set initial state
  updateFormLang(currencyToggle.checked ? 'ar' : 'en');
});