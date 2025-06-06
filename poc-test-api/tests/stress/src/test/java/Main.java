import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import com.typesafe.config.Config;
import io.gatling.javaapi.core.*;
import io.gatling.javaapi.core.FeederBuilder.*;
import com.typesafe.config.ConfigFactory;
import io.gatling.javaapi.http.*;
import scala.annotation.implicitNotFound;

public class Main extends Simulation {

  //mvn gatling:test -Dgatling.simulationClass=simulations.Main

  Config appConfig = ConfigFactory.load("application");
  String baseUrl = appConfig.getString("api.baseUrl");
  String path = appConfig.getString("api.path");
  String facturas = appConfig.getString("api.endpoints.facturas");
  String headerContentType = appConfig.getString("api.headers.contentType");
  String headerAccept = appConfig.getString("api.headers.accept");
  // Se obtienenlas configuraciones del Archivo gatling.conf y se establecen las propiedades a leer
  Config gatlingConfig = ConfigFactory.load("gatling.conf");
  String proxyHostConfig = "gatling.http.proxy.host";
  String proxyPortConfig = "gatling.http.proxy.port";

  Batchable<String> feeder = csv("data/test-data.csv").random();
  HttpProtocolBuilder httpProtocol;


  {
    if (gatlingConfig.hasPath(proxyPortConfig) && gatlingConfig.hasPath(proxyHostConfig)) {
      httpProtocol = http.baseUrl(baseUrl)
              .proxy(Proxy(
                      gatlingConfig.getString(proxyHostConfig),
                      gatlingConfig.getInt(proxyPortConfig))
              );
    } else {
      httpProtocol = http.baseUrl(baseUrl);
    }
  }

  ChainBuilder getFacturas = feed(feeder)
          .exec(http("Ejecución del método GET usuarios.")
                  .get(path + facturas)
                  .header("Content-Type", headerContentType)
                  .header("Accept", headerAccept)
                  .check(
                          status().is(200),
                          status().not(500),
                          status().not(404)
                  )
          );

  ChainBuilder getFactura = feed(feeder).exec(
          http("Ejecución del método GET de un usuario.")
                  .get(path + facturas + "/#{idt}")
                  .header("Content-Type", headerContentType)
                  .header("Accept", headerAccept)
                  .check(
                          status().is(200),
                          status().not(500),
                          status().not(404)
                  )
  );

  ChainBuilder delFactura = feed(feeder).exec(
          http("Ejecución del método DELETE de un usuario.")
                  .delete(path + facturas + "/#{idt}")
                  .header("Content-Type", headerContentType)
                  .header("Accept", headerAccept)
                  .check(
                          status().is(200),
                          status().not(500),
                          status().not(404)
                  )
  );

  ChainBuilder registerFactura = feed(feeder).exec(
          http("Ejecución del método POST de usuario.")
                  .post(path + facturas)
                  .header("Content-Type", headerContentType)
                  .header("Accept", headerAccept)
                  .body(StringBody("{" +
                          "  \"idt\": #{idt}," +
                          "  \"nombreCliente\": \"#{nombreCliente}\"," +
                          "  \"nitCliente\": \"#{nitCliente}\"," +
                          "  \"monto\": #{monto}," +
                          "  \"facturaDetalleList\": [" +
                          "    {" +
                          "      \"idt\": \"#{idtFact}\"," +
                          "      \"codigoSku\": \"#{codigoSku}\"," +
                          "      \"nombreProducto\": \"#{nombreProducto}\"," +
                          "      \"cantidad\": #{cantidad}," +
                          "      \"precioUnitario\": #{precioUnitario}," +
                          "      \"total\": #{total}," +
                          "      \"idtFactura\": {" +
                          "             \"idt\": #{idtFact}" +
                          "      }" +
                          "    }" +
                          "  ]" +
                          "}"))
                  .check(
                          status().is(200),
                          status().not(500)
                  )
  );

  ScenarioBuilder scenarioCrud = scenario("Scenario-CRUD")
          .pause(3)
          .exec(getFacturas, registerFactura, getFactura);

  ScenarioBuilder scenarioStrestCrud = scenario("Scenario-Stress-CRUD")
          .pause(1)
          .exec(getFacturas, registerFactura, getFactura, delFactura);

  {
    setUp(
            scenarioCrud.injectOpen(atOnceUsers(5)),
            scenarioStrestCrud.injectOpen(rampUsers(50).during(30))
    ).protocols(httpProtocol);
  }

}
