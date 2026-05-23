import { Link } from "react-router-dom";
import { useWishlistStore } from "../store/useStore";
import ProductCard from "../components/ProductCard";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="wishlist-page page-with-header">
      <div
        className="container"
        style={{ paddingTop: "40px", paddingBottom: "64px" }}
      >
        <div
          className="section-heading"
          style={{ textAlign: "left", marginBottom: "32px" }}
        >
          <h1>Sevimlilar</h1>
          <p>{items.length} ta sevimli mahsulot</p>
        </div>

        {items.length === 0 ? (
          <div
            className="empty-wishlist"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 20px",
              textAlign: "center",
              gap: "16px",
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed var(--border-medium)",
            }}
          >
            <Heart
              size={60}
              strokeWidth={1.5}
              opacity={0.2}
              style={{ color: "var(--error)" }}
            />
            <h2>Sevimlilar ro'yxati bo'sh</h2>
            <p>Sizga yoqqan mahsulotlarni sevimlilar ro'yxatiga qo'shing</p>
            <Link to="/products" className="btn btn-primary">
              Mahsulotlarni ko'rish <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
