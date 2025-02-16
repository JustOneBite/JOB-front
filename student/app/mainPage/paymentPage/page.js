import PaymentWidget from "@/app/mainPage/paymentPage/paymentWidget";
import styles from './page.module.css';

export default function PaymentPage() {
    return (
    <div className={`${styles.wrapper} ${styles['w-100']}`}>
        <h1 className={styles['text-center']}>결제하기</h1>
        <PaymentWidget />
    </div>
    );
}
