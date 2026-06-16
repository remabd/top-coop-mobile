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
import { loadToken } from "../store/securetoken"; 

interface Creneau {
  id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description?: string | null;
  capacite: number;
}

interface Participation {
  id: string;
  utilisateurId: string;
  creneauId: string;
}

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.12.164.51:3002"; 

export function Participations() {
  const [token, setToken] = useState<string | null>(null);
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCreneauIds, setSelectedCreneauIds] = useState<string[]>([]);
  const [expandedRecapIds, setExpandedRecapIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId = "user-id-dynamique-depuis-redux"; 

  useEffect(() => {
    async function init() {
      const t = await loadToken();
      setToken(t);
      if (t) {
        // Chargement parallèle de toutes les données nécessaires
        await Promise.all([
          fetchCreneaux(t),
          fetchParticipations(t),
          fetchUtilisateurs(t)
        ]);
      }
      setLoading(false);
    }
    init();
  }, []);

  const fetchCreneaux = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/creneau`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      setCreneaux(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur récupération créneaux:", error);
    }
  };

  const fetchParticipations = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participation`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      setParticipations(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur récupération participations:", error);
    }
  };

  const fetchUtilisateurs = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      setUtilisateurs(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Erreur récupération utilisateurs:", error);
    }
  };

  // Récupérer la liste textuelle des participants inscrits à un créneau spécifique
  const getParticipantsForCreneau = (creneauId: string): string[] => {
    return participations
      .filter((p) => p.creneauId === creneauId)
      .map((p) => {
        const u = utilisateurs.find((user) => user.id === p.utilisateurId);
        return u ? `${u.prenom} ${u.nom}` : "Utilisateur Inconnu";
      });
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
    return date.toLocaleDateString('fr-FR', options).replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  const formatDateNumerique = (dateStr: string): string => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
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
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ utilisateurId: currentUserId, creneauId: id }),
        })
      );

      await Promise.all(promises);
      setSelectedCreneauIds([]);
      setIsModalVisible(false);
      alert("Réservation(s) validée(s) avec succès !");
      await fetchParticipations(token); // Rafraîchit les listes d'inscrits en arrière-plan
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      alert("Une erreur est survenue lors de la validation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOGIQUE MAJEURE : FUSION ET RENDU DES CRÉNEAUX SANS DUPLICATION ---
  const renderCreneauxDuJour = () => {
    if (!creneaux || !Array.isArray(creneaux)) return null;

    // 1. Filtrer les créneaux uniques qui se déroulent sur la journée sélectionnée
    const creneauxDuJour = creneaux.filter((c) => {
      if (!c || !c.dateDebut) return false;
      const dateDebut = new Date(c.dateDebut);
      return (
        dateDebut.getDate() === currentDate.getDate() &&
        dateDebut.getMonth() === currentDate.getMonth() &&
        dateDebut.getFullYear() === currentDate.getFullYear()
      );
    });

    // 2. Construire un planning complet heure par heure de 0h à 23h
    const timeline = [];
    let hour = 0;

    while (hour < 24) {
      // Regarder si un créneau englobe l'heure actuelle de la boucle
      const currentHour = hour; 
      const creneauTrouve = creneauxDuJour.find((c) => {
        const hDeb = new Date(c.dateDebut).getHours();
        const hFin = new Date(c.dateFin).getHours();
        return currentHour >= hDeb && currentHour < hFin;
      });

      if (creneauTrouve) {
        const hDeb = new Date(creneauTrouve.dateDebut).getHours();
        const hFin = new Date(creneauTrouve.dateFin).getHours();
        const duration = hFin - hDeb; // Nombre d'heures de s'étalement
        const isSelected = selectedCreneauIds.includes(creneauTrouve.id);

        // On insère UN SEUL bloc fusionné pour toute la durée de l'activité !
        timeline.push(
          <TouchableOpacity
            key={creneauTrouve.id}
            onPress={() => handleToggleCreneau(creneauTrouve.id)}
            style={[
              styles.slotRow,
              styles.slotActive,
              isSelected && styles.slotSelected,
              { paddingVertical: 14 + (duration - 1) * 10 } // Agrandit légèrement le bloc visuellement s'il est long
            ]}
          >
            <Text style={styles.hourText}>{hDeb}h</Text>
            <Text style={[styles.activityText, isSelected && styles.selectedText]}>
              {creneauTrouve.nom}
            </Text>
            <Text style={styles.hourText}>{hFin}h</Text>
          </TouchableOpacity>
        );

        // On fait avancer la boucle directement à la fin du créneau pour éviter les doublons
        hour = hFin;
      } else {
        // Ligne vide standard (1h par ligne)
        timeline.push(
          <View key={`empty-${hour}`} style={[styles.slotRow, styles.slotEmpty]}>
            <Text style={[styles.hourText, styles.disabledText]}>{hour}h</Text>
            <Text style={[styles.activityText, styles.disabledText]}>{"Nom de l'activité"}</Text>
            <Text style={[styles.hourText, styles.disabledText]}>{hour + 1}h</Text>
          </View>
        );
        hour++;
      }
    }

    return timeline;
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

      {/* --- DATE SELECTOR --- */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={handlePreviousDay}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatTexteDate(currentDate)}</Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Text style={styles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* --- TIMELINE DE CRÉNEAUX FUSIONNÉS --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderCreneauxDuJour()}
      </ScrollView>

      {/* --- BOUTON FLOTTANT RÉSERVER --- */}
      {selectedCreneauIds.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.floatingButtonText}>Réservez le créneau</Text>
        </TouchableOpacity>
      )}

      {/* --- MODAL RÉCAPITULATIF REFAITE ET SÉCURISÉE --- */}
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
                
                // Récupération dynamique des participants réels
                const listeParticipants = getParticipantsForCreneau(c.id);

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
                        <Text style={styles.recapCardLabel}>Participants inscrits :</Text>
                        {listeParticipants.length > 0 ? (
                          listeParticipants.map((nomParticipant, index) => (
                            <Text key={index} style={styles.recapCardUser}>
                              • {nomParticipant}
                            </Text>
                          ))
                        ) : (
                          <Text style={[styles.recapCardUser, { fontStyle: "italic", color: "#666" }]}>
                            Personne pour le moment
                          </Text>
                        )}
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
  recapCardUser: { fontFamily: "Outfit_600SemiBold", fontSize: 13, color: "#2C2C2C", paddingLeft: 4, marginVertical: 1 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
  modalButton: { flex: 0.47, paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  btnAnnuler: { backgroundColor: "#3E5243" },
  btnValider: { backgroundColor: "#D4833B" },
  btnTextWhite: { fontFamily: "Outfit_700Bold", color: "#FFF", fontSize: 16 }
});