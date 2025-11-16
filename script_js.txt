/* ===== إعداد Cloudinary ===== */
const CLOUD_NAME = "dywcw157a";
const UPLOAD_PRESET = "bv0t5ao0";
const FOLDER_NAME = "intravvel_uploads";

/* رفع ملف واحد إلى Cloudinary */
async function uploadToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", FOLDER_NAME);

    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (!data.secure_url) {
        alert("خطأ أثناء رفع الملف. حاول مرة أخرى.");
        throw new Error("Upload failed");
    }

    return data.secure_url;
}

/* ===== التحكم في خطوات النموذج ===== */
document.addEventListener("DOMContentLoaded", () => {

    const steps = document.querySelectorAll(".form-step");
    let currentStep = 0;

    function showStep(step) {
        steps.forEach((s, i) => {
            s.style.display = i === step ? "block" : "none";
        });
        currentStep = step;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    showStep(0); // خطوة البداية

    /* زر التالي */
    document.querySelectorAll(".next-btn").forEach((btn, index) => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();

            // تحقق من الحقول المطلوبة
            let inputs = steps[currentStep].querySelectorAll("input[required], select[required]");
            for (let input of inputs) {
                if (!input.value.trim()) {
                    alert("يرجى تعبئة جميع الحقول المطلوبة");
                    return;
                }
            }

            // خطوة رفع الملفات
            if (steps[currentStep].dataset.step === "2") {

                const fileInputs = steps[currentStep].querySelectorAll("input[type='file']");
                btn.innerText = "جاري الرفع...";
                btn.disabled = true;

                for (let inp of fileInputs) {
                    if (inp.files.length > 0) {
                        const file = inp.files[0];
                        const url = await uploadToCloudinary(file);

                        // حقل مخفي لحفظ الرابط
                        const hidden = document.createElement("input");
                        hidden.type = "hidden";
                        hidden.name = inp.name + "_link";
                        hidden.value = url;
                        inp.parentNode.appendChild(hidden);
                    }
                }

                btn.innerText = "التالي";
                btn.disabled = false;
            }

            showStep(currentStep + 1);
        });
    });

    /* زر السابق */
    document.querySelectorAll(".prev-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            showStep(currentStep - 1);
        });
    });

});
