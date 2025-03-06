using Microsoft.AspNetCore.Components.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Text.Json.Serialization;

namespace shrimpcast.Entities.DB
{
    public class Configuration : ICloneable
    {
        [JsonIgnore]
        public int ConfigurationId { get; set; }

        public required bool ChatEnabled { get; set; }

        public required bool EnableVerifiedMode { get; set; }

        public required int MaxConnectionsPerIP { get; set; }

        public required string DefaultName { get; set; }

        public required int MaxMessagesToShow { get; set; }

        public required bool HideStreamTitle { get; set; }

        public required bool StreamEnabled { get; set; }

        public List<Source> Sources { get; set; } = [];

        public required string StreamTitle { get; set; }

        public required string StreamDescription { get; set; }

        public required int MessageDelayTime { get; set; }

        public required int RequiredTokenTimeInMinutes { get; set; }

        public required int MaxLengthTruncation { get; set; }

        public required int OffsetDateTimeInMinutes { get; set; }

        public required bool ShowBingo { get; set; }

        public required string BingoTitle { get; set; }

        public required bool EnableAutoBingoMarking { get; set; }

        public required int AutoMarkingUserCountThreshold { get; set; }

        public required int AutoMarkingSecondsThreshold { get; set; }

        public required bool ShowPoll { get; set; }

        public required bool AcceptNewOptions { get; set; }

        public required bool AcceptNewVotes { get; set; }

        public required bool ShowVotes { get; set; }

        public required string PollTitle { get; set; }

        public required int MinSentToParticipate { get; set; }

        public required int MuteLenghtInMinutes { get; set; }

        public required bool EnableFireworks { get; set; }

        public required bool EnableChristmasTheme { get; set; }

        public required int SnowflakeCount { get; set; }

        public required bool SiteBlockTORConnections { get; set; }

        public required bool ChatBlockTORConnections { get; set; }

        public required bool SiteBlockVPNConnections { get; set; }

        public required bool ChatBlockVPNConnections { get; set; }

        public required string IPServiceApiURL { get; set; }

        [JsonIgnore]
        public string? IPServiceApiKey { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? IPServiceApiKeyNotMapped { get; set; }

        public required string OptionalApiKeyHeader { get; set; }

        public required string VPNDetectionMatchCriteria { get; set; }

        [JsonIgnore]
        public string? OBSHost { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? OBSHostNotMapped { get; set; }

        [JsonIgnore]
        public string? OBSPassword { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? OBSPasswordtNotMapped { get; set; }

        public required string OBSMainScene { get; set; }

        public required string OBSMainSource { get; set; }

        public required string OBSKinoSource { get; set; }

        public required string OBSMusicSource { get; set; }

        public required DateTime OpenAt { get; set; }

        public required int MinABTimeInMs { get; set; }

        public required int MaxABTimeInMs { get; set; }

        public string? VAPIDPublicKey { get; set; }

        [JsonIgnore]
        public string? VAPIDPrivateKey { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? VAPIDPrivateKeyNotMapped { get; set; }

        [JsonIgnore]
        public string? VAPIDMail { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? VAPIDMailNotMapped { get; set; }

        public required bool ShowGoldenPassButton { get; set; }

        public required int GoldenPassValue { get; set; }

        public required string GoldenPassTitle { get; set; }

        public required string BTCServerInstanceURL { get; set; }

        public required string BTCServerStoreId { get; set; }

        [JsonIgnore]
        public string? BTCServerWebhookSecret { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? BTCServerWebhookSecretNotMapped { get; set; }

        [JsonIgnore]
        public string? BTCServerApiKey { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? BTCServerApiKeyNotMapped { get; set; }

        public required string PalettePrimary { get; set; }

        public required string PaletteSecondary { get; set; }

        public required bool UseDarkTheme { get; set; }

        public required bool EnableHalloweenTheme { get; set; }

        public object Clone() => MemberwiseClone();
    }

    public static class ConfigurationExtensions
    {
        public static object BuildJSONConfiguration(this Configuration config) => new object[]
            {
                new
                {
                    name = "Site",
                    values = new object[]
                    {
                        new { name = nameof(config.HideStreamTitle).ToLower(), label = "Esconder título do stream", value = config.HideStreamTitle },
                        new { name = nameof(config.MaxConnectionsPerIP).ToLower(), label = "Máx. de conexões por IP", value = config.MaxConnectionsPerIP },
                        new { name = nameof(config.MinABTimeInMs).ToLower(), label = "Min.tempo automod (ms)", value = config.MinABTimeInMs },
                        new { name = nameof(config.MaxABTimeInMs).ToLower(), label = "Máx. tempo automod (ms)", value = config.MaxABTimeInMs },
                        new { name = nameof(config.OpenAt).ToLower(), label = "Abrir site a", value = config.OpenAt },
                        new { name = nameof(config.StreamTitle).ToLower(), label = "Título stream", value = config.StreamTitle },
                        new { name = nameof(config.StreamDescription).ToLower(), label = "Descrição stream", value = config.StreamDescription },
                    }
                },
                new
                {
                    name = "Chat",
                    values = new object[]
                    {
                        new { name = nameof(config.ChatEnabled).ToLower(), label = "Ligar chat", value = config.ChatEnabled },
                        new { name = nameof(config.EnableVerifiedMode).ToLower(), label = "Permitir apenas verificados", value = config.EnableVerifiedMode },
                        new { name = nameof(config.MaxMessagesToShow).ToLower(), label = "Máx. mensagens visíveis", value = config.MaxMessagesToShow },
                        new { name = nameof(config.OffsetDateTimeInMinutes).ToLower(), label = "Temporizador mensagens (minutos)", value = config.OffsetDateTimeInMinutes },
                        new { name = nameof(config.RequiredTokenTimeInMinutes).ToLower(), label = "Tempo para novos utilizadores participarem (minutos)", value = config.RequiredTokenTimeInMinutes },
                        new { name = nameof(config.MessageDelayTime).ToLower(), label = "Tempo entre mensagens (segundos)", value = config.MessageDelayTime },
                        new { name = nameof(config.MuteLenghtInMinutes).ToLower(), label = "Tempo de silenciar (minutos)", value = config.MuteLenghtInMinutes },
                        new { name = nameof(config.MaxLengthTruncation).ToLower(), label = "Tamanho da mensagem antes de truncar", value = config.MaxLengthTruncation },
                        new { name = nameof(config.DefaultName).ToLower(), label = "Nome padrão para novos utilizadores", value = config.DefaultName },
                    }
                },
                new
                {
                    name = "Stream",
                    values = new object[]
                    {
                        new { name = nameof(config.StreamEnabled).ToLower(), label = "Enable stream", value = config.StreamEnabled },
                        new
                        {
                            name = nameof(config.Sources).ToLower(),
                            label = "Sources",
                            fields = new[]
                            {
                                new { name = nameof(Source.IsEnabled).ToLower(), label = "Ligado" },
                                new { name = nameof(Source.Name).ToLower(), label = "Nome" },
                                new { name = nameof(Source.Url).ToLower(), label = "URL" },
                                new { name = nameof(Source.Thumbnail).ToLower(), label = "Thumbnail" },
                                new { name = nameof(Source.UseLegacyPlayer).ToLower(), label = "Legacy player" },
                                new { name = nameof(Source.UseRTCEmbed).ToLower(), label = "Embutir" },
                                new { name = "delete", label = string.Empty },
                            }
                        }
                    }
                },
                new
                {
                    name = "Poll",
                    values = new object[]
                    {
                        new { name = nameof(config.ShowPoll).ToLower(), label = "Mostrar votação", value = config.ShowPoll },
                        new { name = nameof(config.AcceptNewOptions).ToLower(), label = "Aceitar novas opções", value = config.AcceptNewOptions },
                        new { name = nameof(config.AcceptNewVotes).ToLower(), label = "Aceitar novos votos", value = config.AcceptNewVotes },
                        new { name = nameof(config.ShowVotes).ToLower(), label = "Tornar votos públicos", value = config.ShowVotes },
                        new { name = nameof(config.MinSentToParticipate).ToLower(), label = "Mínimo de mensagens para participar", value = config.MinSentToParticipate },
                        new { name = nameof(config.PollTitle).ToLower(), label = "Título da votação", value = config.PollTitle },
                    }
                },
                new
                {
                    name = "TOR & VPNs",
                    values = new object[]
                    {
                        new { name = nameof(config.SiteBlockTORConnections).ToLower(), label = "Bloquear TOR no site inteiro", value = config.SiteBlockTORConnections },
                        new { name = nameof(config.ChatBlockTORConnections).ToLower(), label = "Bloquear TOR apenas no chat", value = config.ChatBlockTORConnections },
                        new { name = nameof(config.SiteBlockVPNConnections).ToLower(), label = "Bloquear VPNs no site inteiro", value = config.SiteBlockVPNConnections },
                        new { name = nameof(config.ChatBlockVPNConnections).ToLower(), label = "Bloquear VPNs apenas no chat", value = config.ChatBlockVPNConnections },
                        new { name = nameof(config.IPServiceApiURL).ToLower(), label = "URL da API do serviço deteção de VPNs", value = config.IPServiceApiURL },
                        new { name = nameof(config.IPServiceApiKeyNotMapped).ToLower(), label = "Chave API do serviço de deteção de VPNs", value = config.IPServiceApiKey },
                        new { name = nameof(config.OptionalApiKeyHeader).ToLower(), label = "Header opcionar para enviar a chave API", value = config.OptionalApiKeyHeader },
                        new { name = nameof(config.VPNDetectionMatchCriteria).ToLower(), label = "Critério de deteção", value = config.VPNDetectionMatchCriteria },
                    }
                },
                new
                {
                    name = "Bingo",
                    values = new object[]
                    {
                        new { name = nameof(config.ShowBingo).ToLower(), label = "Mostrar bingo", value = config.ShowBingo },
                        new { name = nameof(config.EnableAutoBingoMarking).ToLower(), label = "Ligar auto-marcação", value = config.EnableAutoBingoMarking },
                        new { name = nameof(config.AutoMarkingSecondsThreshold).ToLower(), label = "Limiar de auto-marcação em segundos", value = config.AutoMarkingSecondsThreshold },
                        new { name = nameof(config.AutoMarkingUserCountThreshold).ToLower(), label = "Limiar de utilizadores para auto-marcação", value = config.AutoMarkingUserCountThreshold },
                        new { name = nameof(config.BingoTitle).ToLower(), label = "Título bingo", value = config.BingoTitle },
                    }
                },
                new
                {
                    name = "OBS",
                    values = new object[]
                    {
                        new { name = nameof(config.OBSHostNotMapped).ToLower(), label = "Host", value = config.OBSHost },
                        new { name = nameof(config.OBSPasswordtNotMapped).ToLower(), label = "Senha", value = config.OBSPassword },
                        new { name = nameof(config.OBSMainScene).ToLower(), label = "Cena principal", value = config.OBSMainScene },
                        new { name = nameof(config.OBSMainSource).ToLower(), label = "Cena principal", value = config.OBSMainSource },
                        new { name = nameof(config.OBSKinoSource).ToLower(), label = "Fonte kino", value = config.OBSKinoSource },
                        new { name = nameof(config.OBSMusicSource).ToLower(), label = "Fonte música", value = config.OBSMusicSource },
                    }
                },
                new
                {
                    name = "Theme",
                    values = new object[]
                    {
                        new { name = nameof(config.EnableFireworks).ToLower(), label = "Ligar fogo de artifício", value = config.EnableFireworks },
                        new { name = nameof(config.EnableChristmasTheme).ToLower(), label = "Ligar tema de Natal", value = config.EnableChristmasTheme },
                        new { name = nameof(config.EnableHalloweenTheme).ToLower(), label = "Ligar tema de Halloween", value = config.EnableHalloweenTheme },
                        new { name = nameof(config.SnowflakeCount).ToLower(), label = "Número de flocos de neve de natal", value = config.SnowflakeCount },
                        new { name = nameof(config.UseDarkTheme).ToLower(), label = "Usar contraste escuro (recomendado)", value = config.UseDarkTheme },
                        new { name = nameof(config.PalettePrimary).ToLower(), label = "Cor primária", value = config.PalettePrimary },
                        new { name = nameof(config.PaletteSecondary).ToLower(), label = "Cor secundária", value = config.PaletteSecondary },
                    }
                },
                new
                {
                    name = "Vapid",
                    values = new object[]
                    {
                        new { name = nameof(config.VAPIDPublicKey).ToLower(), label = "Chave VAPID pública", value = config.VAPIDPublicKey },
                        new { name = nameof(config.VAPIDPrivateKeyNotMapped).ToLower(), label = "Chave VAPID privada", value = config.VAPIDPrivateKey },
                        new { name = nameof(config.VAPIDMailNotMapped).ToLower(), label = "VAPID Mail", value = config.VAPIDMail },
                    }
                },
                new
                {
                    name = "Golden pass",
                    values = new object[]
                    {
                        new { name = nameof(config.ShowGoldenPassButton).ToLower(), label = "Ligar compra de OURO", value = config.ShowGoldenPassButton },
                        new { name = nameof(config.GoldenPassValue).ToLower(), label = "Valor do OURO (USD)", value = config.GoldenPassValue },
                        new { name = nameof(config.GoldenPassTitle).ToLower(), label = "Título do OURO", value = config.GoldenPassTitle },
                        new { name = nameof(config.BTCServerInstanceURL).ToLower(), label = "URL da instância BTCPay server", value = config.BTCServerInstanceURL },
                        new { name = nameof(config.BTCServerStoreId).ToLower(), label = "ID da loja BTCPay server", value = config.BTCServerStoreId },
                        new { name = nameof(config.BTCServerApiKeyNotMapped).ToLower(), label = "Chave API BTCPay server", value = config.BTCServerApiKey },
                        new { name = nameof(config.BTCServerWebhookSecretNotMapped).ToLower(), label = "Segredo webhook BTCPay server", value = config.BTCServerWebhookSecret },
                    }
                }
            };
    }
}
