import Dialog from "@reach/dialog";
import VisuallyHidden from "@reach/visually-hidden";
import { ChangeEvent, useState } from "react";
import sty from "./user-modal.module.scss";

type UserModalProps = {
  userId: string;
};

const sec1Data = [
  {
    title: "Pago promedio (dias)",
    content: "15",
  },
  {
    title: "Cheque promedio (dias)",
    content: "10",
  },
  {
    title: "Fecha de factura mas antigua",
    content: "16/05/2022",
  },
  {
    title: "Importe (debe)",
    content: "$150 mil",
  },
];

const sec2Data = [
  {
    monto: "$80.000",
    fecha: "02/05/2022",
  },
  {
    monto: "$70.000",
    fecha: "08/05/2022",
  },
];

const sec3Data = {
  clasificacion: "A",
  datos: [
    { item: "Direccion", value: "Juan B. Justo 4542" },
    { item: "Telefono", value: "0223-11-1111" },
    { item: "Encargado de compras", value: "Juan Perez" },
  ],
};

export default function UserModal({ userId }: UserModalProps) {
  const [showDialog, setShowDialog] = useState(true);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  /* useEffect(() => {
    // fetch user
  }, [userId]); */

  const [filters, setFilters] = useState({
    importe: null,
    ddpago: null,
    ddcheque: null,
  });

  function handleFilterChange(
    event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>,
    filter: string
  ) {
    setFilters({ ...filters, [filter]: event.target.value });
  }

  const FILTERS = [
    <label>
      Importe
      <br />
      <input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={filters.importe || ""}
        onChange={(e) => {
          handleFilterChange(e, "importe");
        }}
      />
    </label>,
    <label>
      Delta dias pago
      <br />
      <select
        value={filters.ddpago || "none"}
        onChange={(e) => handleFilterChange(e, "ddpago")}
      >
        <option value="none">-</option>
        <option value="corto">{"dias < 5"}</option>
        <option value="medio">{"5 < dias < 10"}</option>
        <option value="largo">{"10 < dias < 20"}</option>
        <option value="resto">{"30 < dias"}</option>
      </select>
    </label>,
    <label>
      Delta dias cheque
      <br />
      <select
        value={filters.ddcheque || "none"}
        onChange={(e) => handleFilterChange(e, "ddcheque")}
      >
        <option value="none">-</option>
        <option value="corto">{"dias < 5"}</option>
        <option value="medio">{"5 < dias < 10"}</option>
        <option value="largo">{"10 < dias < 20"}</option>
        <option value="resto">{"30 < dias"}</option>
      </select>
    </label>,
  ];

  return (
    <div>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <div className={sty.container}>
          <div className={sty.content}>
            <button className={sty.closeButton} onClick={close}>
              <VisuallyHidden>Close</VisuallyHidden> <span aria-hidden>×</span>
            </button>

            <p className={sty.title}>
              Comportamiento financiero - Cliente{" "}
              <span className={sty.clientName}>FRANCHRIS2010 S.R.L.</span>
            </p>

            <div className={sty.spacer} />
            <div className={sty.sec3}>
              <div className={sty.sec3Right}>
                <div className={sty.sec3RightRenglon}>
                  <p>Detalles</p>
                </div>
                {sec3Data.datos.map((dato) => (
                  <div className={sty.sec3RightRenglon}>
                    <p>
                      <span
                        className={sty.sec3RightRenglonBold}
                      >{`${dato.item}:  `}</span>
                      {dato.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className={sty.sec3Left}>
                <p className={sty.sec3Title}>Clasificacion del Cliente</p>
                <p className={sty.sec3Content}>{sec3Data.clasificacion}</p>
              </div>
            </div>

            <div className={sty.spacer} />
            <div className={sty.sec4}>
              <div className={sty.sec4Content}>
                <div className={sty.sec4Title}>
                  <p>Comentarios</p>
                </div>
                <textarea rows={5} />
              </div>
            </div>

            <div className={sty.spacer} />
            <div className={sty.sec5}>
              <div className={sty.sec5Content}>
                <div className={sty.sec5Title}>
                  <p>Filtros</p>
                </div>
                <div className={sty.sec5Filters}>
                  {FILTERS.map((filter) => (
                    <div className={sty.sec5FiltersElem}>{filter}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className={sty.spacer} />
            <div className={sty.sec1}>
              {sec1Data.map((item) => (
                <div className={sty.sec1Elem}>
                  <p className={sty.sec1Title}>{item.title}</p>
                  <p className={sty.sec1Content}>{item.content}</p>
                </div>
              ))}
            </div>

            <div className={sty.spacer} />
            <div className={sty.sec2}>
              <div className={sty.sec2Left}>
                <p className={sty.sec2Title}>Cantidad de Facturas Impagas</p>
                <p className={sty.sec2Content}>{sec2Data.length}</p>
              </div>
              <div className={sty.sec2Right}>
                <div className={sty.sec2RightRenglon}>
                  <p>Monto</p>
                  <p>Fecha</p>
                </div>
                {sec2Data.map((item) => (
                  <div className={sty.sec2RightRenglon}>
                    <p>{item.monto}</p>
                    <p>{item.fecha}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
