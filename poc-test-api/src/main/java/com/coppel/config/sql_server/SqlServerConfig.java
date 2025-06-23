package com.coppel.config.sql_server;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
@PropertySource("classpath:application.yaml")
public class SqlServerConfig {
    // @Value("${IPconvencion-Admin}")
    // private String ip;
    // @Value("${DBconvencion-Admin}")
    // private String db;
    // @Value("${USERconvencion-Admin}")
    // private String user;
    // @Value("${PASSconvencion-Admin}")
    // private String pssw;
    // @Value("${IPDBpersonal}")
    // private String ipPer;
    // @Value("${DBpersonal}")
    // private String dbPer;
    // @Value("${USERpersonal}")
    // private String userPer;
    // @Value("${PASSpersonal}")
    // private String psswPer;

    // @Bean(name = "sqlServerconvencionDataSource")
    // @Primary
    // public DataSource sqlServerconvencionDataSource() {
        
    //     // System.out.println(user);
    //     // System.out.println(ip);
    //     // System.out.println(db);
    //     // System.out.println(pssw);
    //     return DataSourceBuilder.create()
    //             .url("jdbc:sqlserver://" + ip + ":1433;databaseName=" + db + ";encrypt=true;trustServerCertificate=true")
    //             .username(user)
    //             .password(pssw)
    //             .driverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver")
    //             .build();
    // }

    // @Bean
    // public JdbcTemplate sqlServerConvencion(@Qualifier("sqlServerconvencionDataSource") DataSource dataSource) {
    //     return new JdbcTemplate(dataSource);
    // }

    // @Bean(name = "sqlServerPersonalDataSource")
    // @Primary
    // public DataSource sqlServerPersonalDataSource() {
        
    //     // System.out.println(ipPer);
    //     // System.out.println(dbPer);
    //     // System.out.println(userPer);
    //     // System.out.println(psswPer);
    //     return DataSourceBuilder.create()
    //             .url("jdbc:sqlserver://" + ipPer + ":1433;databaseName=" + dbPer + ";encrypt=true;trustServerCertificate=true")
    //             .username(userPer)
    //             .password(psswPer)
    //             .driverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver")
    //             .build();
    // }

    // @Bean
    // public JdbcTemplate sqlServerPer(@Qualifier("sqlServerPersonalDataSource") DataSource dataSource) {
    //     return new JdbcTemplate(dataSource);
    // }

    @Bean(name = "sqlServerRespuestasDataSource")
    @Primary
    public DataSource sqlServerRespuestasDataSource() {
        
        // System.out.println(ipPer);
        // System.out.println(dbPer);
        // System.out.println(userPer);
        // System.out.println(psswPer);
        return DataSourceBuilder.create()
                .url("jdbc:sqlserver://51.79.72.212:1433;databaseName=asistenciaConvencion;encrypt=true;trustServerCertificate=true")
                .username("usuario_app")
                .password("MiPassSegura123")
                .driverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver")
                .build();
    }

    @Bean
    public JdbcTemplate sqlServerRes(@Qualifier("sqlServerRespuestasDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

        // //sustitur la info
        // @Bean(name = "mysqlAsistenciaConvencion")
        // public DataSource mysqlDataSource() {
        //     return DataSourceBuilder.create()
        //             .url("jdbc:sqlserver://34.136.188.162;databaseName=asistenciaConvencion;encrypt=true;trustServerCertificate=true")
        //             .username("demospri")
        //             .password("demo1234")
        //             .driverClassName("com.mysql.cj.jdbc.Driver")
        //             .build();
        // }

        // @Bean(name = "jdbcSqlServer")
        // public JdbcTemplate jdbcTemplate(DataSource mysqlDataSource) {
        //     return new JdbcTemplate(mysqlDataSource);
        // }

        // @Bean(name = "sqlServerAsistenciaConvencion")
        // @ConfigurationProperties(prefix = "sqlserver.asistenciaconvencion")
        // public DataSource sqlServerAsistenciaConvencionDataSource() {
        //     return DataSourceBuilder.create().build();
        // }

        // @Bean(name = "sqlServerRespuestas")
        // @ConfigurationProperties(prefix = "sqlserver.per")
        // public DataSource sqlServerPerDataSource() {
        //     return DataSourceBuilder.create().build();
        // }

        // @Bean(name = "jbcSqlServerAsistencia")
        // public JdbcTemplate jbcSqlServerCon(@Qualifier("sqlServerAsistenciaConvencion") DataSource ds) {
        //     return new JdbcTemplate(ds);
        // }

        // @Bean(name = "jdbcSqlServerRespuestas")
        // public JdbcTemplate jdbcSqlServerPer(@Qualifier("sqlServerRespuestas") DataSource ds) {
        //     return new JdbcTemplate(ds);
        // }

    

    
}
