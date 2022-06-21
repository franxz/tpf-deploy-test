import { BottomAxis, LeftAxis } from "./Axes";
import * as d3 from "d3";
import { useState } from "react";

const data = {
  clients: [
    {
      id: 0,
      name: "jose",
      cheques: [
        { id: 0, fecha: "06/02/2022", monto: 6, deltaDias: 10 },
        { id: 1, fecha: "05/25/2022", monto: 6, deltaDias: 10 },
        { id: 2, fecha: "06/20/2022", monto: 8.5, deltaDias: 14 },
      ].sort(
        (a, b) => new Date(a.fecha).valueOf() - new Date(b.fecha).valueOf()
      ),
    },
    {
      id: 1,
      name: "maria",
      cheques: [
        { id: 3, fecha: "07/01/2022", monto: 10, deltaDias: 12 },
        { id: 4, fecha: "06/12/2022", monto: 4, deltaDias: 6 },
      ],
    },
    {
      id: 2,
      name: "pablo",
      cheques: [{ id: 5, fecha: "06/02/2022", monto: 10, deltaDias: 10 }],
    },
  ],
};

/* const dates = data.clients.reduce<Date[]>((prev, client) => {
  const next = prev.concat(
    client.cheques.map((cheque) => new Date(cheque.fecha))
  );
  return next;
}, []); */

/* const datesSum = data.clients.reduce<Date[]>((prev, client) => {
  const next = prev.concat(
    client.cheques.map((cheque) =>
      addDays(new Date(cheque.fecha), cheque.deltaDias)
    )
  );
  return next;
}, []); */

function addDays(date: Date, days: number) {
  var newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export function Chart({ idToClientMap, filteredCC }) {
  const clientIds = Object.keys(idToClientMap);

  if (!clientIds.length) {
    return "Aun no hay datos cargados";
  }

  const [showLine, setShowLine] = useState(false);
  const [showLineCC, setShowLineCC] = useState(false);

  const [mouseLine, setMouseLine] = useState(null);
  const [selectedCheque, setSelectedCheque] = useState(null);

  const [selectedClient, setSelectedClient] = useState(
    data.clients.find((client) => client.id === 0)
  );
  const dates = selectedClient.cheques
    .map((cheque) => new Date(cheque.fecha))
    .concat(selectedClient.cheques.map((cheque) => new Date(cheque.fecha_vto)));
  /* const datesSum = selectedClient.cheques.map((cheque) =>
    addDays(new Date(cheque.fecha), cheque.deltaDias)
  ); */
  const datesCC = filteredCC
    .map((cc) => new Date(cc.fechaInicial))
    .concat(filteredCC.map((cc) => new Date(cc.fechaFinal)));
  console.log(datesCC);

  const cheques = selectedClient.cheques.map((cheque, idx) => ({
    ...cheque,
    start: new Date(cheque.fecha),
    finish: new Date(cheque.fecha_vto),
    monto: cheque.importe,
    /* finish: addDays(new Date(cheque.fecha), cheque.deltaDias), */
  }));

  const chequeH = 25;
  const chequeVspacing = 5;
  const dms = {
    width: 600,
    height: 16 * 2 + (chequeH + chequeVspacing) * cheques.length,
    height2: 16 * 2 + (chequeH + chequeVspacing) * filteredCC.length,
  };
  const margin = 48;

  /* const xDomain = d3.extent(dates.concat(datesSum)); */
  const xDomain = d3.extent(dates);
  const xRange = [0, dms.width];
  const xScale = d3.scaleTime().domain(xDomain).range(xRange);
  const xScaleCC = d3.scaleTime().domain(d3.extent(datesCC)).range(xRange);

  const value = mouseLine ? xScale.invert(mouseLine) : new Date();
  const value2 = mouseLine ? xScaleCC.invert(mouseLine) : new Date();

  const mouseLineColor = "#FF8C32";
  const fechaLineColor = "#FFD9C0";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 18 }}>
        Cheques
      </div>
      <div>
        <span style={{ fontWeight: 600 }}>Cliente: </span>
        <select
          name="clients"
          id="clients"
          onChange={(e) => {
            setSelectedClient(idToClientMap[e.target.value]);
            setSelectedCheque(null);
          }}
        >
          {clientIds.map((clientId) => (
            <option value={clientId}>{idToClientMap[clientId].nombre}</option>
          ))}
        </select>
      </div>
      <svg width={dms.width + margin * 2} height={dms.height + margin * 2}>
        {/*         <rect
          width={dms.width + margin * 2}
          height={dms.height + margin * 2}
          fill="lightgray"
        /> */}
        <g
          transform={`translate(${margin},${margin})`}
          onMouseMove={(e) => setMouseLine(d3.pointer(e)[0])}
          onMouseEnter={() => setShowLine(true)}
          onMouseLeave={() => setShowLine(false)}
        >
          <rect {...dms} fill="lavender" opacity={0.5} />
          {/* FECHA ACTUAL */}
          <g transform={`translate(${xScale(new Date())},0)`}>
            <path
              d={["M", 0, -20, "V", dms.height].join(" ")}
              stroke={fechaLineColor}
              stroke-width="2"
            />
            <circle
              transform={`translate(0,${dms.height})`}
              r="4"
              fill={fechaLineColor}
            />
            <rect
              {...{
                width: 80,
                height: 20,
              }}
              fill={fechaLineColor}
              rx="10"
              ry="10"
              transform={`translate(-40,-20)`}
            />
            <text
              style={{
                fontSize: "12px",
                fontWeight: 600,
                textAnchor: "middle",
                transform: "translateY(-6px)",
              }}
            >
              {`${new Date().getDate()}/${
                new Date().getMonth() + 1
              }/${new Date().getFullYear()}`}
            </text>
          </g>
          {cheques.map((cheque, idx) => (
            <g
              transform={`translate(${xScale(cheque.start)},${16 + idx * 30})`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedCheque(cheque)}
            >
              <rect
                className="chequeRect"
                style={
                  selectedCheque && selectedCheque.id === cheque.id
                    ? { fill: "#0074d9" }
                    : {
                        fill:
                          cheque.estado_cheque === "ENTREGADO"
                            ? "#CC704B"
                            : "#92BA92",
                      }
                }
                {...{
                  width: xScale(cheque.finish) - xScale(cheque.start),
                  height: chequeH,
                }}
                /*    fill={
                  selectedCheque && selectedCheque.id === cheque.id
                    ? "blue"
                    : "red"
                } */
                rx="5"
                ry="5"
              />
              <text
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textAnchor: "middle",
                  transform: `translate(${
                    (xScale(cheque.finish) - xScale(cheque.start)) / 2
                  }px, 17px)`,
                }}
                fill="white"
                pointerEvents="none"
              >
                ${(cheque.monto * 1).toLocaleString()}
              </text>
            </g>
          ))}
          {/* {mouseLine && (
            <g transform={`translate(${mouseLine - margin},${dms.height})`}>
              <path
                d={["M", 0, 30, "V", -dms.height].join(" ")}
                fill="none"
                stroke="white"
              />
              <circle r="8" fill="white" />
              <text
                style={{
                  fontSize: "12px",
                  textAnchor: "middle",
                  transform: "translateY(45px)",
                }}
              >
                {`${value.getDate()}/${
                  value.getMonth() + 1
                }/${value.getFullYear()}`}
              </text>
            </g>
          )} */}

          {/* EJES */}
          <g transform={`translate(0,${dms.height})`}>
            {/* <LeftAxis {...dms} /> */}
            <BottomAxis {...dms} domain={xDomain} />
          </g>

          {/* FECHA MOUSE */}
          {mouseLine && showLine && (
            <g transform={`translate(${mouseLine},0)`} pointerEvents="none">
              <circle
                transform={`translate(0,${dms.height})`}
                r="6"
                fill={mouseLineColor}
              />
              <path
                d={["M", 0, -20, "V", dms.height].join(" ")}
                stroke={mouseLineColor}
                stroke-width="2"
              />
              <rect
                {...{
                  width: 80,
                  height: 20,
                }}
                fill={mouseLineColor}
                rx="10"
                ry="10"
                transform={`translate(-40,-20)`}
              />
              <text
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textAnchor: "middle",
                  transform: "translateY(-6px)",
                }}
              >
                {`${value.getDate()}/${
                  value.getMonth() + 1
                }/${value.getFullYear()}`}
              </text>
            </g>
          )}
        </g>
      </svg>
      {selectedCheque && (
        <div
          style={{ padding: 8, border: "1px solid lightgray", borderRadius: 5 }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: 4,
              fontWeight: 600,
              fontSize: 14,
              borderBottom: "1px solid lightgray",
            }}
          >
            Detalle del cheque
          </div>
          <div className="chequeDetail" style={{ fontSize: 12 }}>
            <div style={{ display: "flex" }}>Codigo</div>
            <div style={{ display: "flex" }}>{selectedCheque.cheque_nro}</div>
            <div style={{ display: "flex" }}>Monto</div>
            <div style={{ display: "flex" }}>
              ${(selectedCheque.monto * 1).toLocaleString()}
            </div>
            <div style={{ display: "flex" }}>Estado</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {selectedCheque.estado_cheque === "ENTREGADO" ? (
                <>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "100%",
                      backgroundColor: "#CC704B",
                      marginRight: 4,
                    }}
                  ></div>
                  Entregado
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "100%",
                      backgroundColor: "#92BA92",
                      marginRight: 4,
                    }}
                  ></div>
                  Depositado
                </>
              )}
            </div>
            <div style={{ display: "flex" }}>Fecha de pago</div>
            <div style={{ display: "flex" }}>{`${new Date(
              selectedCheque.fecha
            ).getDate()}/${
              new Date(selectedCheque.fecha).getMonth() + 1
            }/${new Date(selectedCheque.fecha).getFullYear()}`}</div>
            <div style={{ display: "flex" }}>Fecha de vencimiento</div>
            <div style={{ display: "flex" }}>{`${new Date(
              selectedCheque.fecha_vto
            ).getDate()}/${
              new Date(selectedCheque.fecha_vto).getMonth() + 1
            }/${new Date(selectedCheque.fecha_vto).getFullYear()}`}</div>
            <div style={{ display: "flex" }}>Banco</div>
            <div style={{ display: "flex" }}>
              {selectedCheque.descrip_banco.split("-")[0]}
            </div>
          </div>
        </div>
      )}

      {/* CUENTAS CORRIENTES 
SS
SS
SS

SS
SS
SS*/}
      <div
        style={{
          marginTop: 32,
          marginBottom: 0,
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        Cuentas Corrientes (delta dias)
      </div>
      <svg width={dms.width + margin * 2} height={dms.height2 + margin * 2}>
        {/*         <rect
          width={dms.width + margin * 2}
          height={dms.height + margin * 2}
          fill="lightgray"
        /> */}
        <g
          transform={`translate(${margin},${margin})`}
          onMouseMove={(e) => setMouseLine(d3.pointer(e)[0])}
          onMouseEnter={() => setShowLineCC(true)}
          onMouseLeave={() => setShowLineCC(false)}
        >
          <rect
            {...{ width: dms.width, height: dms.height2 }}
            fill="lavender"
            opacity={0.5}
          />
          {/* FECHA ACTUAL */}
          <g transform={`translate(${xScaleCC(new Date())},0)`}>
            <path
              d={["M", 0, -20, "V", dms.height2].join(" ")}
              stroke={fechaLineColor}
              stroke-width="2"
            />
            <circle
              transform={`translate(0,${dms.height2})`}
              r="4"
              fill={fechaLineColor}
            />
            <rect
              {...{
                width: 80,
                height: 20,
              }}
              fill={fechaLineColor}
              rx="10"
              ry="10"
              transform={`translate(-40,-20)`}
            />
            <text
              style={{
                fontSize: "12px",
                fontWeight: 600,
                textAnchor: "middle",
                transform: "translateY(-6px)",
              }}
            >
              {`${new Date().getDate()}/${
                new Date().getMonth() + 1
              }/${new Date().getFullYear()}`}
            </text>
          </g>
          {filteredCC.map((cheque, idx) => (
            <g
              transform={`translate(${xScaleCC(
                new Date(cheque.fechaInicial)
              )},${16 + idx * 30})`}
              style={{ cursor: "pointer" }}
            >
              <rect
                className="chequeRect"
                style={{ fill: "#0074d9" }}
                {...{
                  width:
                    xScaleCC(new Date(cheque.fechaFinal)) -
                    xScaleCC(new Date(cheque.fechaInicial)),
                  height: chequeH,
                }}
                /*    fill={
                  selectedCheque && selectedCheque.id === cheque.id
                    ? "blue"
                    : "red"
                } */
                rx="5"
                ry="5"
              />
              <text
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textAnchor: "middle",
                  transform: `translate(${
                    (xScaleCC(new Date(cheque.fechaFinal)) -
                      xScaleCC(new Date(cheque.fechaInicial))) /
                    2
                  }px, 17px)`,
                }}
                fill="white"
                pointerEvents="none"
              >
                {`${cheque.DiasPago} - ${cheque.razon_social}`}
              </text>
            </g>
          ))}
          {/* {mouseLine && (
            <g transform={`translate(${mouseLine - margin},${dms.height})`}>
              <path
                d={["M", 0, 30, "V", -dms.height].join(" ")}
                fill="none"
                stroke="white"
              />
              <circle r="8" fill="white" />
              <text
                style={{
                  fontSize: "12px",
                  textAnchor: "middle",
                  transform: "translateY(45px)",
                }}
              >
                {`${value.getDate()}/${
                  value.getMonth() + 1
                }/${value.getFullYear()}`}
              </text>
            </g>
          )} */}

          {/* EJES */}
          <g transform={`translate(0,${dms.height2})`}>
            {/* <LeftAxis {...dms} /> */}
            <BottomAxis {...dms} domain={d3.extent(datesCC)} />
          </g>

          {/* FECHA MOUSE */}
          {mouseLine && showLineCC && (
            <g transform={`translate(${mouseLine},0)`} pointerEvents="none">
              <circle
                transform={`translate(0,${dms.height2})`}
                r="6"
                fill={mouseLineColor}
              />
              <path
                d={["M", 0, -20, "V", dms.height2].join(" ")}
                stroke={mouseLineColor}
                stroke-width="2"
              />
              <rect
                {...{
                  width: 80,
                  height: 20,
                }}
                fill={mouseLineColor}
                rx="10"
                ry="10"
                transform={`translate(-40,-20)`}
              />
              <text
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textAnchor: "middle",
                  transform: "translateY(-6px)",
                }}
              >
                {`${value2.getDate()}/${
                  value2.getMonth() + 1
                }/${value2.getFullYear()}`}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

/* export function Chart() {
  const dms = { width: 600, height: 400 };
  const margin = 100;
  return (
    <div>
      <svg width={dms.width + margin * 2} height={dms.height + margin * 2}>
        <rect
          width={dms.width + margin * 2}
          height={dms.height + margin * 2}
          fill="lightgray"
        />
        <g transform={`translate(${margin},${margin})`}>
          <rect {...dms} fill="lavender" />
          <g transform={`translate(0,${dms.height})`}>
            <LeftAxis {...dms} />
            <BottomAxis {...dms} />
          </g>
        </g>
      </svg>
    </div>
  );
} */
