# 📱 Success OS — Οδηγός Εγκατάστασης

## Πώς να βάλεις το Success OS στο iPhone σου

### Βήμα 1: Δημιούργησε GitHub Repository

1. Πήγαινε στο [github.com/new](https://github.com/new)
2. Ονόμασε το repo: `success-os`
3. Επίλεξε **Public** (απαιτείται για δωρεάν GitHub Pages)
4. Πάτα **Create repository**

### Βήμα 2: Push τον κώδικα στο GitHub

Από τον υπολογιστή σου, άνοιξε τερματικό στον φάκελο `success-os` και τρέξε:

```bash
git init
git add .
git commit -m "Success OS v1.0"
git branch -M main
git remote add origin https://github.com/USERNAME/success-os.git
git push -u origin main
```

> ⚠️ Αντικατέστησε το `USERNAME` με το GitHub username σου.

### Βήμα 3: Ενεργοποίησε GitHub Pages

1. Πήγαινε στο repo σου στο GitHub
2. Πάτα **Settings** (⚙️)
3. Στο αριστερό μενού, πάτα **Pages**
4. Στο **Source**, επίλεξε **GitHub Actions**
5. Το workflow θα τρέξει αυτόματα (δες στο tab **Actions**)
6. Μόλις ολοκληρωθεί ✅, το site σου είναι live!

Το URL θα είναι: `https://USERNAME.github.io/success-os/`

### Βήμα 4: Εγκατάσταση στο iPhone 🎯

1. Άνοιξε το **Safari** στο iPhone σου
2. Πληκτρολόγησε: `https://USERNAME.github.io/success-os/`
3. Πάτα το κουμπί **Κοινοποίηση** (⬆️ κάτω κέντρο)
4. Σκρόλαρε και πάτα **«Προσθήκη στην οθόνη Αφετηρίας»**
5. Ονόμασέ το **Success OS**
6. Πάτα **Προσθήκη**

Τώρα έχεις το Success OS σαν app στο Home Screen σου! 🎉

---

## 🔄 Ενημερώσεις

Κάθε φορά που κάνεις αλλαγές στον κώδικα και push στο GitHub:

```bash
git add .
git commit -m "Update"
git push
```

Το GitHub Actions θα κάνει auto-build & deploy. Η εφαρμογή ενημερώνεται αυτόματα!

> 💡 Για να δεις τη νέα version στο iPhone, απλά άνοιξε το app ξανά — θα φορτώσει τα τελευταία αρχεία.

---

## ⚠️ Σημαντικές Σημειώσεις

- **Safari Only**: Η "Προσθήκη στην Αφετηρία" λειτουργεί μόνο μέσω Safari (όχι Chrome/Firefox)
- **Τα δεδομένα σου**: Αποθηκεύονται τοπικά στο iPhone σου (localStorage). Αν καθαρίσεις τα cookies/data του Safari, θα χαθούν
- **Offline**: Η εφαρμογή λειτουργεί μόνο με σύνδεση στο internet (δεν έχει Service Worker)
- **Custom Domain**: Μπορείς να συνδέσεις custom domain (π.χ. `successos.gr`) μέσα από GitHub Pages Settings

---

## 🛠 Τεχνικές Λεπτομέρειες

| Στοιχείο | Τεχνολογία |
|----------|-----------|
| Framework | Next.js 15 (Static Export) |
| UI | Tailwind CSS + shadcn/ui |
| State | Zustand + localStorage |
| Animations | Framer Motion |
| Hosting | GitHub Pages (δωρεάν) |
| PWA | Web App Manifest + Apple Meta Tags |
| CI/CD | GitHub Actions (αυτόματο deploy) |