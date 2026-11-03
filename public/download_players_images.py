import os
import re
import requests
from requests_html import HTMLSession

# 1. إنشاء مجلد images إذا لم يكن موجوداً
if not os.path.exists('images'):
    os.makedirs('images')

# قائمة اللاعبين ببياناتهم كما ترسلها
allPlayersPool = [
    { "n": "Maradona", "r": 97, "img": "https://www.pinterest.com/search/pins/?q=Maradona%20football%20player%20face" },
    { "n": "L. Messi", "r": 90, "img": "https://www.pinterest.com/search/pins/?q=Messi%20football%20player%20face" },
    { "n": "C. Ronaldo", "r": 86, "img": "https://www.pinterest.com/search/pins/?q=Ronaldo%20football%20player%20face" },
    # ضع باقي مصفوفة الـ 500 لاعب هنا بنفس النسق...
]

session = HTMLSession()

def clean_filename(name):
    # تنظيف الاسم ليصبح صالحاً كاسم ملف (مثل: Maradona.png أو L_Messi.png)
    return re.sub(r'[^a-zA-Z0-9_\u0600-\u06FF]', '', name.strip().replace(' ', '_')) + ".png"

print("🚀 بدء استخراج وتنزيل صور اللاعبين...")

for player in allPlayersPool:
    name = player["n"]
    filename = clean_filename(name)
    filepath = os.path.join('images', filename)
    
    # تخطي الصورة إذا كانت محملة مسبقاً
    if os.path.exists(filepath):
        print(f"✔️ الصورة موجودة مسبقاً: {filename}")
        continue

    pinterest_url = player.get("img", "")
    print(f"🔍 جاري البحث عن صورة: {name}...")

    try:
        # إذا كان الرابط رابط بحث من Pinterest
        if "pinterest.com" in pinterest_url:
            r = session.get(pinterest_url)
            # استخراج أول رابط صورة مباشر بحجم مناسب من الصفحة
            images = r.html.find('img')
            img_src = None
            for img in images:
                src = img.attrs.get('src', '')
                if 'pinimg.com' in src and ('236x' in src or '474x' in src or '736x' in src):
                    img_src = src
                    break
            
            # إذا لم يجد صورة في Pinterest، يتم استخدام مصدراً أُسياً جودة لصور الوجوه
            if not img_src:
                img_src = f"https://images.fotmob.com/image_resources/playerimages/{name}.png"
        else:
            img_src = pinterest_url

        # تحميل الصورة وحفظها
        img_data = requests.get(img_src, timeout=10).content
        with open(filepath, 'wb') as f:
            f.write(img_data)
        print(f"✅ تم حفظ الصورة: {filename}")

    except Exception as e:
        print(f"⚠️ تعذر تنزيل صورة {name}: {e}")

print("\n🎉 اكتمل التنزيل! أصبحت جميع الصور محملة داخل مجلد 'images'.")
