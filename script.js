const CLOUD_NAME = "intravvel_uploads";
const UPLOAD_PRESET = "bv0t5ao0";

async function upload(file) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
    let fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    let res = await fetch(url, { method:"POST", body:fd });
    let data = await res.json();
    return data.secure_url;
}

function go(step) {
    document.querySelectorAll(".form-step").forEach(s=>s.classList.remove("active"));
    document.querySelector(`[data-step="${step}"]`).classList.add("active");
}

document.getElementById("next1").onclick = () => {
    if (!fullName.value || !phone.value || !email.value || !country.value || !service.value) {
        alert("يرجى تعبئة جميع البيانات");
        return;
    }
    go(2);
};

document.getElementById("back1").onclick = () => go(1);

document.getElementById("next2").onclick = async () => {
    if (!personalPic.files[0] || !passport.files[0] || !residency.files[0]) {
        alert("يرجى رفع جميع المستندات المطلوبة");
        return;
    }

    go(3);

    // رفع المستندات Cloudinary
    let picURL = await upload(personalPic.files[0]);
    let passURL = await upload(passport.files[0]);
    let resURL = await upload(residency.files[0]);

    window.formUploads = { picURL, passURL, resURL };

    reviewBox.innerHTML = `
        <p><strong>الاسم:</strong> ${fullName.value}</p>
        <p><strong>رقم الهاتف:</strong> ${phone.value}</p>
        <p><strong>الإيميل:</strong> ${email.value}</p>
        <p><strong>الدولة:</strong> ${country.value}</p>
        <p><strong>الخدمة:</strong> ${service.value}</p>
        <p style='margin-top:10px;'><strong>الصور:</strong></p>
        <a href="${picURL}" target="_blank">الصورة الشخصية</a><br>
        <a href="${passURL}" target="_blank">جواز السفر</a><br>
        <a href="${resURL}" target="_blank">الإقامة</a>
    `;
};

document.getElementById("back2").onclick = () => go(2);

applyForm.onsubmit = async (e) => {
    e.preventDefault();

    const formData = {
        access_key: "7f9473c5-37b1-422c-be8e-e25f6cd3251b",
        name: fullName.value,
        phone: phone.value,
        email: email.value,
        country: country.value,
        service: service.value,
        personalPic: formUploads.picURL,
        passport: formUploads.passURL,
        residency: formUploads.resURL,
    };

    let send = await fetch("https://api.web3forms.com/submit", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(formData)
    });

    if (send.ok) {
        alert("تم إرسال الطلب بنجاح 🎉");
        window.location.href = "index.html";
    } else {
        alert("حدث خطأ أثناء الإرسال");
    }
};
