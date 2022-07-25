import "../../App.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Chart } from "../../features/dashboard/Chart";
import {
  getCantFacturasImpagas,
  getCCdias,
  getCheques,
  getFechasFacturaImpaga,
  getSaldos,
} from "../../services/services";
import { Table } from "../../features/dashboard/table";
import { FileUploader } from "../../features/excel-files/file-uploader/file-uploader";

type Tabs = "dashboard" | "archivos";

export function Home(): JSX.Element {
  const [idToClientMap, setIdToClientMap] = useState({});
  const [tableData, setTableData] = useState([]);
  /* const [filteredCC, setFilteredCC] = useState<any[]>([]); */
  const [selectedTab, setSelectedTab] = useState<Tabs>("dashboard");
  const { user } = useContext(UserContext);
  const [selectedClient, setSelectedClient] = useState(-1);

  const tabsStyle = {
    color: "white",
    fontWeight: 600,
    fontSize: 14,
    marginRight: 16,
    padding: 4,
  };
  const tabSeparator = (
    <p style={{ ...tabsStyle, paddingRight: 32, paddingLeft: 32 }}>|</p>
  );

  function handleClientClick(clientId: number) {
    setSelectedClient(clientId);
  }

  useEffect(() => {
    /* getCCdias().then((clients) => {
      const clientes = clients as any[];
      clientes.sort((a, b) => b.DiasPago - a.DiasPago);
      setFilteredCC(clientes.filter((cliente) => cliente.DiasPago));
    }); */

    (async function getData() {
      const [cheques, cantFacturas, fechasFactura, saldos] = await Promise.all([
        getCheques(),
        getCantFacturasImpagas(),
        getFechasFacturaImpaga(),
        getSaldos(),
      ]);

      const idToClient = {};

      cheques.forEach((cheque) => {
        const cliente = idToClient[cheque.Id_cliente];
        cliente
          ? cliente.cheques.push(cheque)
          : (idToClient[cheque.Id_cliente] = {
              id: cheque.Id_cliente,
              nombre: cheque.descrip_cliente,
              cheques: [cheque],
            });
      });
      cantFacturas.forEach((data) => {
        if (!idToClient[data.Id_cliente]) {
          idToClient[data.Id_cliente] = {
            id: data.Id_cliente,
            nombre: data.razon_social,
          };
        }
        idToClient[data.Id_cliente].factImpCant = data.impagas || 0;
      });
      fechasFactura.forEach((data) => {
        if (!idToClient[data.Id_cliente]) {
          idToClient[data.Id_cliente] = {
            id: data.Id_cliente,
            nombre: data.razon_social,
          };
        }
        idToClient[data.Id_cliente].factimpFecha = data["MIN(C.fecha_recibo)"];
      });
      saldos.forEach((data) => {
        if (!idToClient[data.Id_cliente]) {
          idToClient[data.Id_cliente] = {
            id: data.Id_cliente,
            nombre: data.razon_social,
          };
        }
        idToClient[data.Id_cliente].ccSaldo = data.saldoCliente;
      });

      setIdToClientMap(idToClient);

      const tabData = Object.values(idToClient).map((item) => {
        if (item.ccSaldo) {
          item.ccSaldo = item.ccSaldo.toLocaleString();
        }
        if (item.factimpFecha) {
          item.factimpFecha = new Date(item.factimpFecha)
            .toISOString()
            .slice(0, 10);
        }
        if (item.factImpCant === 0) {
          item.factimpFecha = "-";
        }
        return item;
      });

      console.log(tabData);
      setTableData(tabData);
    })();
    /* getCheques().then((checks) => {
      const cheques = checks as any[];
      console.log(cheques);
      setIdToClientMap(
        cheques.reduce<Record<string, any>>((prev, cheque) => {
          const cliente = prev[cheque.Id_cliente];
          cliente
            ? cliente.cheques.push(cheque)
            : (prev[cheque.Id_cliente] = {
                id: cheque.Id_cliente,
                nombre: cheque.descrip_cliente,
                cheques: [cheque],
              });
          return prev;
        }, {})
      );
    }); */
  }, []);

  return (
    <div>
      {user.isLoggedIn ? (
        <>
          <div
            style={{
              backgroundColor: "black",
              alignItems: "center",
              width: "100%",
              height: 48,
              marginTop: -18,
              marginBottom: 16,
              display: "flex",
              paddingLeft: 32,
            }}
          >
            <p
              style={tabsStyle}
              className="interactiveTab"
              onClick={() => setSelectedTab("dashboard")}
            >
              Dashboard
            </p>
            {tabSeparator}
            <p
              style={tabsStyle}
              className="interactiveTab"
              onClick={() => setSelectedTab("archivos")}
            >
              Archivos
            </p>
          </div>
          {selectedTab === "dashboard" && (
            <>
              <Table data={tableData} handleClientClick={handleClientClick} />
              <Chart
                idToClientMap={idToClientMap}
                /* filteredCC={filteredCC} */ selectedClientId={selectedClient}
              />
            </>
          )}
          {selectedTab === "archivos" && <FileUploader />}
        </>
      ) : (
        <p>❌ Debes iniciar sesion para ver esta seccion</p>
      )}
    </div>
  );
}
