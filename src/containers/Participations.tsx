import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { loadToken } from "../store/securetoken"; 

interface Creneau {
  id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description?: string | null;
  capacite: number;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.12.164.51:3002"; 

export function Participations() {
  const [token, setToken] = useState<string | null>(null);
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialisation sur la date du jour actuelle
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCreneauIds, setSelectedCreneauIds] = useState<string[]>([]);
  const [expandedRecapIds, setExpandedRecapIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId = "user-id-dynamique-depuis-redux"; 

  // MODIFICATION : On génère les 24 heures de la journée (de 0h à 23h) pour tout couvrir
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    async function init() {
      const t = await loadToken();
      setToken(t);
      if (t) {
        await fetchCreneaux(t);
      } else {
        setLoading(false);
      }
    }
    init();
  }, []);

  const fetchCreneaux = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/creneau`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCreneaux(data);
      } else if (data && Array.isArray(data.data)) { 
        setCreneaux(data.data);
      } else {
        setCreneaux([]);
      }
    } catch (error) {
      console.error("Erreur récupération créneaux:", error);
      setCreneaux([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
    setSelectedCreneauIds([]); 
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
    setSelectedCreneauIds([]); 
  };

  const formatTexteDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateString = date.toLocaleDateString('fr-FR', options);
    return dateString.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  const formatDateNumerique = (dateStr: string): string => {
    const d = new Date(dateStr);
    const jour = String(d.getDate()).padStart(2, '0');
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    const annee = d.getFullYear();
    return `${jour}/${mois}/${annee}`;
  };

  const handleToggleCreneau = (creneauId: string) => {
    setSelectedCreneauIds((prev) => {
      const updated = prev.includes(creneauId)
        ? prev.filter((id) => id !== creneauId)
        : [...prev, creneauId];
      
      setExpandedRecapIds(updated);
      return updated;
    });
  };

  const toggleExpandRecap = (id: string) => {
    setExpandedRecapIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleValiderReservations = async () => {
    if (!token) return;
    setIsSubmitting(true);

    try {
      const promises = selectedCreneauIds.map((id) =>
        fetch(`${API_BASE_URL}/participation`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            utilisateurId: currentUserId,
            creneauId: id,
          }),
        })
      );

      await Promise.all(promises);
      setSelectedCreneauIds([]);
      setIsModalVisible(false);
      alert("Réservation(s) validée(s) avec succès !");
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert("Une erreur est survenue lors de la validation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // CORRECTION DE LA LOGIQUE DE FILTRAGE DES HEURES
  const getCreneauForHour = (hour: number) => {
    if (!creneaux || !Array.isArray(creneaux)) return undefined;

    return creneaux.find((c) => {
      if (!c || !c.dateDebut || !c.dateFin) return false;
      
      const dateDebut = new Date(c.dateDebut);
      const dateFin = new Date(c.dateFin);

      // 1. On vérifie d'abord si le créneau appartient bien au jour affiché à l'écran
      const estMemeJour = 
        dateDebut.getDate() === currentDate.getDate() &&
        dateDebut.getMonth() === currentDate.getMonth() &&
        dateDebut.getFullYear() === currentDate.getFullYear();

      if (!estMemeJour) return false;

      // 2. On vérifie si l'heure de la ligne (hour) est comprise à l'intérieur du créneau
      const heureDebut = dateDebut.getHours();
      const heureFin = dateFin.getHours();

      // Gestion des créneaux larges (ex: 12h à 18h) : la ligne s'active si l'heure courante est dedans
      return hour >= heureDebut && hour < heureFin;
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#D4833B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.headerContainer}>
        <Text style={styles.titlePage}>Participations</Text>
        <Text style={styles.subtitlePage}>
          Vous avez <Text style={{ fontWeight: "bold" }}>Xh</Text> à réaliser ce mois-ci.
        </Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Voir mes participations</Text>
        </TouchableOpacity>
      </View>

      {/* --- DATE SELECTOR DYNAMIQUE --- */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={handlePreviousDay}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatTexteDate(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* --- LISTE DES CRENEAUX COMPACTE --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {hours.map((hour) => {
          const creneau = getCreneauForHour(hour);
          const isSelected = creneau ? selectedCreneauIds.includes(creneau.id) : false;

          return (
            <TouchableOpacity
              key={hour}
              disabled={!creneau}
              onPress={() => creneau && handleToggleCreneau(creneau.id)}
              style={[
                styles.slotRow,
                creneau ? styles.slotActive : styles.slotEmpty,
                isSelected && styles.slotSelected,
              ]}
            >
              <Text style={[styles.hourText, !creneau && styles.disabledText]}>{hour}h</Text>
              <Text style={[styles.activityText, !creneau && styles.disabledText, isSelected && styles.selectedText]}>
                {creneau ? creneau.nom : "Nom de l'activité"}
              </Text>
              <Text style={[styles.hourText, !creneau && styles.disabledText]}>{hour + 1}h</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* --- BOUTON DE RESERVATION --- */}
      {selectedCreneauIds.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.floatingButtonText}>Réservez le créneau</Text>
        </TouchableOpacity>
      )}

      {/* --- MODAL RECAPITULATIF --- */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Récapitulatif</Text>
            <Text style={styles.modalSubtitle}>Vous avez choisi le(s) créneau(x) suivants :</Text>

            <ScrollView style={{ maxHeight: 280, width: "100%", marginBottom: 20 }}>
              {selectedCreneauIds.map((id) => {
                if (!creneaux || !Array.isArray(creneaux)) return null;

                const c = creneaux.find((item) => item.id === id);
                if (!c) return null;
                
                const isExpanded = expandedRecapIds.includes(id);
                const heureDeb = new Date(c.dateDebut).getHours();
                const heureFin = new Date(c.dateFin).getHours();

                return (
                  <View key={id} style={styles.recapCardContainer}>
                    <TouchableOpacity 
                      style={styles.recapHeaderRow} 
                      onPress={() => toggleExpandRecap(id)}
                    >
                      <Text style={styles.arrowIcon}>{isExpanded ? "🔽" : "▶️"}</Text>
                      <Text style={styles.recapCardTitle}>
                        {c.nom} de {heureDeb}h à {heureFin}h le {formatDateNumerique(c.dateDebut)}
                      </Text>
                    </TouchableOpacity>
                    
                    {isExpanded && (
                      <View style={styles.recapCardDetails}>
                        <Text style={styles.recapCardLabel}>Participants</Text>
                        <Text style={styles.recapCardUser}>M. Nom</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.btnAnnuler]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.btnTextWhite}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.btnValider]}
                onPress={handleValiderReservations}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.btnTextWhite}>Valider</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FBF7", paddingTop: 50 },
  center: { justifyContent: "center", alignItems: "center" },
  headerContainer: { alignItems: "center", marginBottom: 15 },
  titlePage: { fontFamily: "Outfit_700Bold", fontSize: 26, color: "#D4833B", marginBottom: 10 },
  subtitlePage: { fontFamily: "Outfit_400Regular", fontSize: 15, color: "#333" },
  linkText: { fontFamily: "Outfit_600SemiBold", color: "#3E5C45", textDecorationLine: "underline", marginTop: 5 },
  dateSelector: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, marginBottom: 15 },
  dateText: { fontFamily: "Outfit_700Bold", fontSize: 18, color: "#2C2C2C" },
  arrow: { fontSize: 22, fontWeight: "bold", color: "#2C2C2C", paddingHorizontal: 10 },
  scrollContainer: { paddingHorizontal: 15, paddingBottom: 100 },
  slotRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, paddingHorizontal: 15, borderRadius: 4, marginBottom: 8 },
  slotEmpty: { backgroundColor: "#EBEBEB" },
  slotActive: { backgroundColor: "#D6EBD3" },
  slotSelected: { backgroundColor: "#A8D4A3" },
  hourText: { fontFamily: "Outfit_600SemiBold", fontSize: 14, color: "#000", width: 35 },
  activityText: { fontFamily: "Outfit_400Regular", fontSize: 15, color: "#333", flex: 1, textAlign: "center" },
  selectedText: { fontFamily: "Outfit_600SemiBold" },
  disabledText: { color: "#BFBFBF" },
  floatingButton: { position: "absolute", bottom: 30, left: "15%", right: "15%", backgroundColor: "#D4833B", paddingVertical: 15, borderRadius: 8, alignItems: "center", elevation: 4 },
  floatingButtonText: { fontFamily: "Outfit_700Bold", color: "#FFF", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "88%", backgroundColor: "#FFF", borderRadius: 20, padding: 20, alignItems: "center" },
  modalTitle: { fontFamily: "Outfit_700Bold", fontSize: 22, color: "#2C2C2C", marginBottom: 15 },
  modalSubtitle: { fontFamily: "Outfit_400Regular", fontSize: 14, color: "#4A4A4A", textAlign: "center", marginBottom: 20 },
  recapCardContainer: { backgroundColor: "#D6EBD3", borderRadius: 8, marginBottom: 10, width: "100%", overflow: "hidden" },
  recapHeaderRow: { flexDirection: "row", alignItems: "center", padding: 12 },
  arrowIcon: { fontSize: 14, fontWeight: "bold", marginRight: 6, color: "#2C2C2C" },
  recapCardTitle: { fontFamily: "Outfit_400Regular", fontSize: 14, color: "#2C2C2C", flex: 1 },
  recapCardDetails: { backgroundColor: "rgba(255, 255, 255, 0.4)", paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: "#B5D6B1" },
  recapCardLabel: { fontFamily: "Outfit_400Regular", fontSize: 12, color: "#555", marginBottom: 4 },
  recapCardUser: { fontFamily: "Outfit_600SemiBold", fontSize: 13, color: "#2C2C2C", paddingLeft: 4 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
  modalButton: { flex: 0.47, paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  btnAnnuler: { backgroundColor: "#3E5243" },
  btnValider: { backgroundColor: "#D4833B" },
  btnTextWhite: { fontFamily: "Outfit_700Bold", color: "#FFF", fontSize: 16 }
});