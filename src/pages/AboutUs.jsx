import React from "react";
import styles from "./AboutUs.module.scss";
import {
  FaLeaf,
  FaCloud,
  FaGift,
  FaLink,
  FaShoppingBag,
  FaLaptop,
  FaGlobe,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      <h1>О КОМПАНИИ GREENLEAF</h1>

      {/* Видео и информация */}
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <video
            controls
            className={styles.video}
            poster="https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png"
          >
            <source
              src="https://green-leaf.shop/GREENLEAF.mp4"
              type="video/mp4"
            />
            Ваш браузер не поддерживает видео.
          </video>
        </div>
        <div className={styles.videoInfo}>
          <h2>О КОМПАНИИ GREENLEAF</h2>
          <ul className={styles.companyInfoList}>
            <li>
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              GREENLEAF основан в 1998 году и до 2016 года работал только в
              Китае.
            </li>
            <li>
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              GREENLEAF с 2018 года официально зарегистрировалась в России как
              ООО "Зеленый лист".
            </li>
            <li>
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              GREENLEAF занимается исследованиями, разработкой технологий,
              производством, международным сотрудничеством и маркетингом.
            </li>
            <li>
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              GREENLEAF - технологический лидер в биохимической промышленности
              Китая.
            </li>
            <li>
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              GREENLEAF имеет пять научно-исследовательских центров и пять
              производственных баз.
            </li>
            <li>
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              GREENLEAF объединяет традиционный линейный бизнес, сетевой
              маркетинг и франчайзинг.
            </li>
          </ul>
        </div>
      </section>

      {/* Блок преимуществ партнеров */}
      <section className={styles.partnersBenefits}>
        <h2>КАЖДЫЙ ПАРТНЕР КОМПАНИИ GREENLEAF ПОЛУЧАЕТ:</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaCloud />
            </div>
            <h3>БИЗНЕС КАБИНЕТ</h3>
            <p>
              Бизнес место в партнерской системе, дающее возможность участвовать
              в распределении прибыли, согласно маркетинг плана.
            </p>
            <p>Онлайн кошелек.</p>
            <p>Маркетинговые инструменты для продвижения бизнеса.</p>
            <p>Обучение от компании.</p>
            <p>Круглосуточная онлайн поддержка</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaGift />
            </div>
            <h3>ПОДАРОЧНЫЙ НАБОР ПРОДУКЦИИ</h3>
            <p>Выбираете набор исходя из выбранного бизнес пакета.</p>
            <p>
              Наборы продукции отправляются бесплатно, в любой город России.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaLink />
            </div>
            <h3>ПАРТНЕРСКИЕ ЦЕНЫ ОТ ПРОИЗВОДИТЕЛЯ</h3>
            <p>
              Право на покупку продукции по партнерской цене со скидкой 50%.
            </p>
            <p>
              Купоны в подарок. При регистрации вам начисляются подарочные
              электронные купоны. С помощью них вы сможете приобретать купонные
              товары со скидкой до 50%.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaShoppingBag />
            </div>
            <h3>ПРИБЫЛЬ ОТ РОЗНИЧНОЙ ТОРГОВЛИ И СЕРВИСНОГО ЦЕНТРА</h3>
            <p>Наценка от ваших продаж может достигать 200-300%.</p>
            <p>
              Сопровождение профессиональной команды по открытию вашей торговой
              точи и интернет-магазина.
            </p>
            <p>
              Специальные условия и бонусная система для содержания сервисного
              центра.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaLaptop />
            </div>
            <h3>ПРИБЫЛЬ В ВИДЕ 12 ВОЗНАГРАЖДЕНИЙ</h3>
            <p>Инновационный маркетинг план.</p>
            <p>
              Без обязательной ежемесячной активности - покупки только при
              необходимости.
            </p>
            <p>Не требуется подтверждение квалификации.</p>
            <p>
              Товарооборот сохраняется, накапливается и дает право постепенного
              выхода на лидерские ранги.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>
              <FaGlobe />
            </div>
            <h3>НОВАЯ ЛОГИСТИКА</h3>
            <p>
              Greenleaf полностью берёт на себя международную транспортную
              доставку и таможню через границу, обеспечив юридическую и
              финансовую гарантию для партнёров по всему миру.
            </p>
            <p>
              Продукция доставляется в Ваш город или населенный пункт за счёт
              компании производителя.
            </p>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>10 МЛРД</div>
          <div className={styles.statDescription}>
            Планы достижения ежегодных продаж в размере 10 миллиардов долларов
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>&gt; 30</div>
          <div className={styles.statDescription}>
            Более чем 30 стран и регионов мира
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>68 МЛН</div>
          <div className={styles.statDescription}>
            Промышленный косметический парк с инвестицией в 68 миллионов
            долларов
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>&gt; 300 000</div>
          <div className={styles.statDescription}>
            Более 300 000 партнеров по всему миру
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
