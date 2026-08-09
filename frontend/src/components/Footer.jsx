import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-plum text-blush-light mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="font-display text-2xl tracking-widest2">TREZAR</span>
          <p className="text-sm text-blush-light/70 mt-3 leading-relaxed">
            Fashion jewelry made for everyday wear and your biggest days —
            designed in soft rose-gold tones, made to be worn often.
          </p>
        </div>

        <div>
          <h4 className="font-label text-xs uppercase tracking-widest2 text-gold-soft mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-blush-light/80">
            <li><Link to="/shop?category=earrings" className="hover:text-white">Earrings</Link></li>
            <li><Link to="/shop?category=necklace-sets" className="hover:text-white">Necklace Sets</Link></li>
            <li><Link to="/shop?category=bridal-sets" className="hover:text-white">Bridal Sets</Link></li>
            <li><Link to="/shop" className="hover:text-white">All Products</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-label text-xs uppercase tracking-widest2 text-gold-soft mb-4">Help</h4>
          <ul className="space-y-2 text-sm text-blush-light/80">
            <li>Cash on Delivery available nationwide</li>
            <li>JazzCash &amp; Easypaisa accepted</li>
            <li>Card payments supported</li>
            <li>Delivery in 3–6 working days</li>
          </ul>
        </div>

        <div>
          <h4 className="font-label text-xs uppercase tracking-widest2 text-gold-soft mb-4">Get in touch</h4>
          <ul className="space-y-2 text-sm text-blush-light/80">
            <li>WhatsApp: +92 3XX XXXXXXX</li>
            <li>hello@trezar.pk</li>
            <li>Lahore, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-blush-light/50 py-5">
        © {new Date().getFullYear()} Trezar. All rights reserved.
      </div>
    </footer>
  );
}
