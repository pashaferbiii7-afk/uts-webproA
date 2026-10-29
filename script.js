document.addEventListener("DOMContentLoaded", function () {
    // TAHUN OTOMATIS DI FOOTER
    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // NIGHT MODE
    const themeToggle = document.getElementById("theme-toggle");

    function updateThemeButton() {
        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "☀️";
            themeToggle.setAttribute("aria-label", "Aktifkan mode terang");
        } else {
            themeToggle.textContent = "🌙";
            themeToggle.setAttribute("aria-label", "Aktifkan mode gelap");
        }
    }

    try {
        if (localStorage.getItem("portfolio-theme") === "dark") {
            document.body.classList.add("dark-mode");
        }
    } catch (error) {
        // Website tetap berjalan jika penyimpanan browser tidak tersedia.
    }

    updateThemeButton();

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        try {
            const theme = document.body.classList.contains("dark-mode")
                ? "dark"
                : "light";

            localStorage.setItem("portfolio-theme", theme);
        } catch (error) {
            // Perubahan tema tetap berlaku selama halaman terbuka.
        }

        updateThemeButton();
    });

    // MENU NAVIGASI HP
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
        );
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });

    // VALIDASI FORMULIR KONTAK
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    const fields = [
        {
            id: "name",
            errorId: "name-error",
            message: "Nama wajib diisi."
        },
        {
            id: "email",
            errorId: "email-error",
            message: "Masukkan alamat email yang valid."
        },
        {
            id: "subject",
            errorId: "subject-error",
            message: "Subjek wajib diisi."
        },
        {
            id: "message",
            errorId: "message-error",
            message: "Pesan wajib diisi."
        }
    ];

    function validateField(field) {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        const value = input.value.trim();

        let errorMessage = "";

        if (!value) {
            errorMessage = field.id === "email"
                ? "Email wajib diisi."
                : field.message;
        } else if (
            field.id === "email" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
            errorMessage = field.message;
        }

        errorElement.textContent = errorMessage;
        input.classList.toggle("invalid", Boolean(errorMessage));
        input.setAttribute("aria-invalid", String(Boolean(errorMessage)));

        return !errorMessage;
    }

    fields.forEach(function (field) {
        const input = document.getElementById(field.id);

        input.addEventListener("blur", function () {
            validateField(field);
        });

        input.addEventListener("input", function () {
            if (input.classList.contains("invalid")) {
                validateField(field);
            }
        });
    });

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const isValid = fields
            .map(validateField)
            .every(Boolean);

        if (!isValid) {
            formStatus.textContent =
                "Periksa kembali data yang kamu masukkan.";
            formStatus.className = "error";

            const firstInvalid = contactForm.querySelector(".invalid");

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        const emailSubject = encodeURIComponent(subject);
        const emailBody = encodeURIComponent(
            "Nama: " + name +
            "\nEmail: " + email +
            "\n\nPesan:\n" + message
        );

        const mailtoLink =
            "mailto:pashaferbiii7@gmail.com" +
            "?subject=" + emailSubject +
            "&body=" + emailBody;

        formStatus.textContent =
            "Formulir valid. Membuka aplikasi email...";
        formStatus.className = "success";

        window.location.href = mailtoLink;
    });
});