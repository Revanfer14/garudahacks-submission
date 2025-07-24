export interface Dongeng {
  title: string;
  region: string;
  category: string;
  readTime: string;
  content: string;
  moral: string;
}

// Definisi tipe untuk item daftar dongeng (digunakan di DongengPage)
export interface DongengListItem {
  id: number;
  title: string;
  region: string;
  description: string;
  readTime: string;
  category: string;
}

// Objek data dongeng lengkap (untuk halaman detail)
export const dongengData: { [key: string]: Dongeng } = {
  "1": {
    title: "Malin Kundang",
    region: "Sumatra Barat",
    category: "Moral",
    readTime: "8 menit",
    content: `Di sebuah desa nelayan di pesisir Sumatra Barat, hiduplah seorang janda miskin bernama Mande Rubayah bersama anak laki-lakinya yang bernama Malin Kundang. Meski hidup dalam kemiskinan, sang ibu sangat menyayangi Malin dan selalu berusaha memberikan yang terbaik untuknya.

Suatu hari, Malin yang sudah beranjak dewasa memutuskan untuk merantau ke negeri seberang untuk mengubah nasib keluarganya. Dengan berat hati, ibunya melepas kepergian Malin setelah memberikan doa dan restu.

Bertahun-tahun berlalu, Malin Kundang berhasil menjadi seorang pedagang yang sangat kaya. Ia menikah dengan seorang putri bangsawan dan hidup dalam kemewahan. Suatu hari, kapal dagangnya berlabuh di kampung halamannya.

Mande Rubayah yang sudah tua dan keriput mendengar kabar tentang kedatangan kapal besar. Dalam hatinya berharap bahwa itu adalah kapal anaknya. Ketika melihat Malin yang sudah berpakaian mewah, ia berlari mendekatinya dengan penuh kerinduan.

"Malin, anakku! Ibu sangat merindukanmu," seru Mande Rubayah sambil memeluk Malin.

Namun, Malin Kundang malah menolak dan menyangkal bahwa wanita tua itu adalah ibunya. Ia malu memiliki ibu yang compang-camping dan miskin di depan istrinya yang cantik.

"Pergi! Aku tidak mengenal wanita tua ini! Penjaga, usir dia dari sini!" bentak Malin.

Hati Mande Rubayah hancur melihat sikap anaknya. Dengan air mata berlinang, ia mengangkat tangan ke langit dan berdoa:

"Ya Allah, jika benar dia anakku Malin Kundang, dan jika dia tidak mau mengakui ibunya sendiri, kutuklah dia menjadi batu!"

Seketika itu juga, langit mendung dan angin kencang bertiup. Badai besar melanda kapal Malin Kundang. Kapal yang megah itu hancur dan Malin Kundang berubah menjadi batu di pesisir pantai.

Hingga kini, batu yang konon adalah Malin Kundang masih dapat dilihat di pantai Air Manis, Padang, sebagai pengingat bahwa seorang anak tidak boleh durhaka kepada orang tuanya.`,
    moral:
      "Cerita ini mengajarkan pentingnya berbakti kepada orang tua dan tidak melupakan asal-usul kita meskipun sudah sukses.",
  },
  "2": {
    title: "Sangkuriang",
    region: "Jawa Barat",
    category: "Legenda",
    readTime: "12 menit",
    content: `Dahulu kala, di tanah Pasundan hiduplah seorang raja yang memiliki putri cantik bernama Dayang Sumbi. Putri ini memiliki kesaktian yang luar biasa dan awet muda.

Suatu hari, ketika sedang menenun, kelos benangnya jatuh. Karena malas turun untuk mengambilnya, ia bersumpah: "Barangsiapa yang mengambilkan kelos benangku, jika laki-laki akan kujadikan suami, jika perempuan akan kujadikan saudara."

Ternyata yang mengambil kelos tersebut adalah seekor anjing jantan bernama Tumang. Karena terikat sumpah, Dayang Sumbi terpaksa menerima Tumang sebagai suaminya. Dari perkawinan yang tidak biasa ini, lahirlah seorang anak laki-laki yang tampan bernama Sangkuriang.

Sangkuriang tumbuh menjadi pemuda yang gagah dan suka berburu. Tumang selalu menemaninya berburu, namun Sangkuriang tidak tahu bahwa Tumang adalah ayahnya sendiri.

Pada suatu hari berburu, Sangkuriang tidak mendapat hasil buruan sama sekali. Dalam keadaan kesal, ia menyalahkan Tumang dan membunuhnya. Hati anjing itu ia bawa pulang dan diberikan kepada ibunya untuk dimasak.

Dayang Sumbi yang tidak tahu bahwa itu adalah hati Tumang, memasaknya. Namun ketika mengetahui kebenaran dari Sangkuriang, ia sangat marah dan memukul kepala anaknya dengan sendok nasi hingga terluka. Sangkuriang kemudian pergi merantau meninggalkan ibunya.

Bertahun-tahun kemudian, Sangkuriang kembali ke kampung halamannya. Karena kesaktiannya, Dayang Sumbi tetap terlihat muda dan cantik. Sangkuriang yang tidak mengenali ibunya sendiri, jatuh cinta dan melamarnya.

Ketika menyadari bahwa yang melamarnya adalah anaknya sendiri, Dayang Sumbi terkejut. Namun Sangkuriang tetap berkeras ingin menikahinya. Akhirnya Dayang Sumbi memberikan syarat yang sangat berat: Sangkuriang harus membuat danau dan perahu besar dalam waktu semalam.

Sangkuriang menerima tantangan itu. Dengan kesaktiannya, ia mulai bekerja membendung Sungai Citarum untuk membuat danau dan menebang pohon-pohon besar untuk membuat perahu.

Melihat pekerjaannya hampir selesai, Dayang Sumbi menjadi panik. Ia meminta bantuan para wanita di desa untuk menumbuk padi dan menyalakan api di sebelah timur, sehingga terlihat seperti fajar telah menyingsing.

Ayam-ayam jantan pun berkokok mengira hari telah pagi. Sangkuriang yang merasa tertipu dan gagal menyelesaikan tugasnya menjadi sangat marah. Dengan kekuatannya, ia menendang perahu yang hampir jadi itu.

Perahu tersebut terbalik dan menjadi Gunung Tangkuban Perahu, sementara bendungan yang ia buat menjadi Danau Bandung. Sangkuriang sendiri hilang entah ke mana.

Itulah asal-usul Gunung Tangkuban Perahu yang bentuknya menyerupai perahu terbalik dan Danau Bandung yang kini telah menjadi daratan kota Bandung.`,
    moral:
      "Cerita ini mengajarkan tentang konsekuensi dari kemarahan yang tidak terkendali dan pentingnya mengendalikan emosi.",
  },
};

// Array data daftar dongeng (untuk halaman daftar)
export const dongengList: DongengListItem[] = [
  {
    id: 1,
    title: "Malin Kundang",
    region: "Sumatra Barat",
    description:
      "Kisah seorang anak yang durhaka kepada ibunya dan mendapat kutukan menjadi batu.",
    readTime: "8 menit",
    category: "Moral",
  },
  {
    id: 2,
    title: "Sangkuriang",
    region: "Jawa Barat",
    description:
      "Legenda tentang asal-usul Gunung Tangkuban Perahu dan danau Bandung.",
    readTime: "12 menit",
    category: "Legenda",
  },
  {
    id: 3,
    title: "Roro Jonggrang",
    region: "Jawa Tengah",
    description:
      "Cerita cinta yang tragis antara Roro Jonggrang dan Bandung Bondowoso.",
    readTime: "15 menit",
    category: "Legenda",
  },
  {
    id: 4,
    title: "Timun Mas",
    region: "Jawa Tengah",
    description:
      "Petualangan seorang gadis bernama Timun Mas yang melarikan diri dari raksasa.",
    readTime: "10 menit",
    category: "Petualangan",
  },
  {
    id: 5,
    title: "Keong Mas",
    region: "Jawa Timur",
    description:
      "Kisah seorang putri yang dikutuk menjadi keong emas oleh ibu tirinya.",
    readTime: "9 menit",
    category: "Fantasi",
  },
  {
    id: 6,
    title: "Si Kancil dan Buaya",
    region: "Kalimantan",
    description: "Kecerdikan Si Kancil dalam mengakali buaya-buaya yang lapar.",
    readTime: "6 menit",
    category: "Fabel",
  },
];
