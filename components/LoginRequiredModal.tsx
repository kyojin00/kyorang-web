"use client";

export default function LoginRequiredModal({
  open,
  onClose,
  onGoLogin,
}: {
  open: boolean;
  onClose: () => void;
  onGoLogin: () => void;
}) {
  if (!open) return null;

  return (
    <div className="modalDim" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHead">로그인이 필요해요 🐰</div>
        <div className="modalBody">
          구매/장바구니 기능을 사용하려면 로그인해야 해요.
          <br />
          로그인 페이지로 이동할까요?
        </div>
        <div className="modalActions">
          <button className="btn ghost" type="button" onClick={onClose}>
            취소
          </button>
          <button className="btn pink" type="button" onClick={onGoLogin}>
            로그인으로 이동하기
          </button>
        </div>
      </div>
    </div>
  );
}
